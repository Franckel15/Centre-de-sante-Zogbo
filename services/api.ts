import { supabase } from './supabaseClient';
import { BLOG_POSTS } from '../constants';

// --- TYPES & INTERFACES ---
export interface AudioResource {
  id: number;
  title: string;
  serviceName: string;
  url: string;
  description?: string;
  created_at?: string;
}

export interface VideoResource {
  id: number;
  title: string;
  url: string;
  category?: string;
  created_at?: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  caption: string;
  category: string;
  created_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string; 
  image: string;
  category: string;
  service?: string;
  created_at?: string;
}

export interface Appointment {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  reason?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  tracking_code?: string;
}

export interface ContactMessage {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'unread' | 'read';
}

export interface Announcement {
  id: number;
  message: string;
  type: 'alert' | 'info';
  active: boolean;
}

// --- UTILS ---
const getPathFromUrl = (url: string): string | null => {
  if (!url) return null;
  try {
    const parts = url.split('/storage/v1/object/public/');
    if (parts.length > 1) {
      const pathParts = parts[1].split('/');
      pathParts.shift(); // remove bucket name
      return decodeURIComponent(pathParts.join('/'));
    }
    return null;
  } catch (e) { 
    console.error("Erreur parsing URL storage:", e);
    return null; 
  }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API IMPLEMENTATION ---
export const api = {
  system: {
    checkHealth: async (): Promise<boolean> => {
      try {
        const { error } = await supabase.from('site_images').select('key').limit(1).maybeSingle();
        return !error;
      } catch (e) {
        console.error("Erreur de vérification santé système:", e);
        return false;
      }
    }
  },

  auth: {
    signIn: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
    getSession: () => supabase.auth.getSession(),
    onAuthStateChange: (callback: any) => supabase.auth.onAuthStateChange(callback)
  },

  siteImages: {
    getAll: async (): Promise<Record<string, string>> => {
      let attempts = 0;
      while (attempts < 3) {
        try {
          const { data, error } = await supabase.from('site_images').select('*');
          if (error) throw error;
          const map: Record<string, string> = {};
          data?.forEach((item: any) => {
            if (item.key && item.url) map[item.key] = item.url;
          });
          return map;
        } catch (e) {
          attempts++;
          console.warn(`Tentative ${attempts}/3 de chargement des images du site:`, e);
          if (attempts >= 3) {
            console.error("Échec définitif du chargement des images depuis Supabase:", e);
            return {};
          }
          await wait(500 * attempts);
        }
      }
      return {};
    },
    upload: async (key: string, file: File): Promise<string> => {
      // Sécurité : Vérifier qu'une session authentifiée existe
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Accès non autorisé : Vous devez être connecté en tant qu'administrateur.");
      }

      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const fileName = `site-assets/${key}_${Date.now()}_${cleanName}`;
        
        const { error: upErr } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
        if (upErr) {
          console.error("Erreur upload storage Supabase:", upErr);
          throw upErr;
        }
        
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        const { error: dbErr } = await supabase.from('site_images').upsert({
          key, url: publicUrl
        });
        if (dbErr) {
          console.error("Erreur enregistrement DB site_images:", dbErr);
          throw dbErr;
        }
        return publicUrl;
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image du site:", error);
        throw error;
      }
    }
  },

  videos: {
    getAll: async (): Promise<VideoResource[]> => {
      try {
        const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error("Erreur chargement vidéos Supabase:", error);
          return [];
        }
        return (data || []).map((item: any) => ({
          id: Number(item.id),
          title: item.title,
          url: item.url,
          category: item.category,
          created_at: item.created_at
        }));
      } catch (e) {
        console.error("Exception lors de la récupération des vidéos:", e);
        return [];
      }
    },
    create: async (meta: { title: string, category?: string }, file: File) => {
      const fileName = `vid_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from('video-files').upload(fileName, file);
      if (upErr) {
        console.error("Erreur upload vidéo:", upErr);
        throw upErr;
      }
      const { data: { publicUrl } } = supabase.storage.from('video-files').getPublicUrl(fileName);
      const { data, error } = await supabase.from('videos').insert([{
        title: meta.title, category: meta.category || 'Général', url: publicUrl
      }]).select().single();
      if (error) {
        console.error("Erreur insert vidéo DB:", error);
        throw error;
      }
      return data;
    },
    delete: async (id: number, url: string) => {
      if (url) {
        const path = getPathFromUrl(url);
        if (path) await supabase.storage.from('video-files').remove([path]);
      }
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) {
        console.error("Erreur suppression vidéo DB:", error);
        throw error;
      }
      return true;
    }
  },

  gallery: {
    getAll: async (): Promise<GalleryImage[]> => {
      try {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error("Erreur chargement galerie Supabase:", error);
          return [];
        }
        return (data || []).map((item: any) => ({
          id: Number(item.id),
          url: item.url,
          caption: item.caption,
          category: item.category,
          created_at: item.created_at
        }));
      } catch (e) {
        console.error("Exception chargement galerie:", e);
        return [];
      }
    },
    create: async (meta: { caption: string, category: string }, file: File) => {
      const fileName = `gallery_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from('images').upload(fileName, file);
      if (upErr) {
        console.error("Erreur upload photo galerie:", upErr);
        throw upErr;
      }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      const { data, error } = await supabase.from('gallery').insert([{
        caption: meta.caption, category: meta.category, url: publicUrl
      }]).select().single();
      if (error) {
        console.error("Erreur insert galerie DB:", error);
        throw error;
      }
      return data;
    },
    delete: async (id: number, url: string) => {
      if (url) {
        const path = getPathFromUrl(url);
        if (path) await supabase.storage.from('images').remove([path]);
      }
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) {
        console.error("Erreur suppression galerie:", error);
        throw error;
      }
      return true;
    }
  },

  audios: {
    getAll: async (): Promise<AudioResource[]> => {
      try {
        const { data, error } = await supabase.from('audios').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error("Erreur chargement audios Supabase:", error);
          return [];
        }
        return (data || []).map((item: any) => ({
          id: Number(item.id),
          title: item.title,
          serviceName: item.service_name,
          url: item.url,
          description: item.description,
          created_at: item.created_at
        }));
      } catch (e) {
        console.error("Exception chargement audios:", e);
        return [];
      }
    },
    create: async (meta: { title: string; serviceName: string; description?: string }, file: File) => {
      const fileName = `aud_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from('audio-files').upload(fileName, file);
      if (upErr) {
        console.error("Erreur upload audio storage:", upErr);
        throw upErr;
      }
      const { data: { publicUrl } } = supabase.storage.from('audio-files').getPublicUrl(fileName);
      const { data, error } = await supabase.from('audios').insert([{
        title: meta.title, service_name: meta.serviceName, description: meta.description, url: publicUrl
      }]).select().single();
      if (error) {
        console.error("Erreur insert audio DB:", error);
        throw error;
      }
      return data;
    },
    update: async (id: number, meta: { title: string; serviceName: string; description?: string }, file?: File) => {
      const updates: any = { title: meta.title, service_name: meta.serviceName, description: meta.description };
      if (file) {
        const fileName = `aud_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from('audio-files').upload(fileName, file);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('audio-files').getPublicUrl(fileName);
        updates.url = data.publicUrl;
      }
      const { data, error } = await supabase.from('audios').update(updates).eq('id', id).select().single();
      if (error) {
        console.error("Erreur update audio DB:", error);
        throw error;
      }
      return data;
    },
    delete: async (id: number, url: string) => {
      if (url) {
        const path = getPathFromUrl(url);
        if (path) await supabase.storage.from('audio-files').remove([path]);
      }
      const { error } = await supabase.from('audios').delete().eq('id', id);
      if (error) {
        console.error("Erreur delete audio DB:", error);
        throw error;
      }
      return true;
    }
  },

  blog: {
    getAll: async (): Promise<BlogPost[]> => {
      try {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (error || !data || data.length === 0) {
          if (error) console.warn("Supabase posts warning (fallback to default posts):", error);
          return BLOG_POSTS.map((p, i) => ({ ...p, created_at: new Date().toISOString(), id: p.id || i + 1000 }));
        }
        return data.map((item: any) => ({
          id: Number(item.id),
          title: item.title,
          excerpt: item.excerpt,
          date: new Date(item.created_at).toLocaleDateString('fr-FR'),
          image: item.image,
          category: item.category || 'Actualité',
          service: item.service,
          created_at: item.created_at
        }));
      } catch (e) {
        console.error("Exception chargement articles blog:", e);
        return BLOG_POSTS.map((p, i) => ({ ...p, created_at: new Date().toISOString(), id: p.id || i + 1000 }));
      }
    },
    create: async (meta: { title: string; excerpt: string; service?: string }, file: File) => {
      const fileName = `blog_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from('images').upload(fileName, file);
      if (upErr) {
        console.error("Erreur upload image blog:", upErr);
        throw upErr;
      }
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
      const { data, error } = await supabase.from('posts').insert([{
        title: meta.title, excerpt: meta.excerpt, category: 'Actualité', service: meta.service, image: publicUrl
      }]).select().single();
      if (error) {
        console.error("Erreur insertion article blog:", error);
        throw error;
      }
      return data;
    },
    getById: async (id: number): Promise<BlogPost | null> => {
      try {
        const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
        if (error || !data) {
          return (BLOG_POSTS.find(p => p.id === id) as any) || null;
        }
        return {
          id: Number(data.id),
          title: data.title,
          excerpt: data.excerpt,
          date: new Date(data.created_at).toLocaleDateString('fr-FR'),
          image: data.image,
          category: data.category,
          service: data.service,
          created_at: data.created_at
        };
      } catch (e) {
        console.error("Exception chargement article blog by ID:", e);
        return (BLOG_POSTS.find(p => p.id === id) as any) || null;
      }
    },
    update: async (id: number, meta: { title: string; excerpt: string; service?: string }, file?: File) => {
      const updates: any = { title: meta.title, excerpt: meta.excerpt, service: meta.service };
      if (file) {
        const fileName = `blog_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from('images').upload(fileName, file);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('images').getPublicUrl(fileName);
        updates.image = data.publicUrl;
      }
      const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single();
      if (error) {
        console.error("Erreur mise à jour article blog:", error);
        throw error;
      }
      return data;
    },
    delete: async (id: number, imageUrl?: string) => {
      if (imageUrl) {
        const path = getPathFromUrl(imageUrl);
        if (path) await supabase.storage.from('images').remove([path]);
      }
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) {
        console.error("Erreur suppression article blog:", error);
        throw error;
      }
      return true;
    }
  },

  appointments: {
    create: async (formData: { name: string; phone: string; service: string; date: string; time: string; reason?: string; tracking_code: string }) => {
      // 1. Enregistrement impératif et direct dans la base de données Supabase
      const { data, error } = await supabase.from('appointments').insert([{
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        date: formData.date,
        time: formData.time,
        reason: formData.reason?.trim() || '',
        tracking_code: formData.tracking_code,
        status: 'pending'
      }]).select().single();

      if (error) {
        console.error("Erreur critique d'insertion du rendez-vous dans Supabase:", error);
        throw new Error(error.message || "Échec de l'enregistrement du rendez-vous sur le serveur.");
      }

      return data;
    },
    getAll: async (): Promise<Appointment[]> => {
      try {
        const { data, error } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error("Erreur chargement rendez-vous Supabase:", error);
          throw error;
        }
        return (data || []).map(d => ({ ...d, id: Number(d.id) })) as Appointment[];
      } catch (e) {
        console.error("Exception lors de la récupération des rendez-vous:", e);
        throw e;
      }
    },
    delete: async (id: number) => {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (error) {
        console.error("Erreur suppression rendez-vous:", error);
        throw error;
      }
      return true;
    },
    updateStatus: async (id: number, status: 'pending' | 'confirmed' | 'cancelled') => {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (error) {
        console.error("Erreur mise à jour statut rendez-vous:", error);
        throw error;
      }
      return true;
    },
    checkStatus: async (code: string): Promise<{ found: boolean; status?: string; rdv_date?: string; rdv_time?: string }> => {
      const normalizedCode = code.trim().toUpperCase();
      if (!normalizedCode) return { found: false };

      try {
        const { data, error } = await supabase.rpc('get_appointment_status_by_code', { code_input: normalizedCode });
        
        if (error) {
          console.warn("Erreur RPC checkStatus:", error.message);
          // Fallback direct sécurisé par tracking_code exact si RPC non dispo
          const { data: directData, error: selectErr } = await supabase
            .from('appointments')
            .select('status, date, time')
            .eq('tracking_code', normalizedCode)
            .limit(1);

          if (selectErr) {
            console.error("Erreur fallback direct appointments:", selectErr);
            return { found: false };
          }
          if (directData && directData.length > 0) {
            return {
              found: true,
              status: directData[0].status,
              rdv_date: directData[0].date,
              rdv_time: directData[0].time
            };
          }
          return { found: false };
        }

        if (data) {
          const result = Array.isArray(data) ? data[0] : data;
          if (result && result.found) return result;
        }
      } catch (e) {
        console.error("Exception checkStatus:", e);
      }

      return { found: false };
    },
    recoverCode: async (name: string, phone: string): Promise<{ found: boolean; tracking_code?: string }> => {
      const cleanPhone = phone.replace(/\s/g, '');
      if (!name.trim() || !cleanPhone) return { found: false };

      try {
        const { data, error } = await supabase.rpc('recover_appointment_code', { 
          name_input: name.trim(), 
          phone_input: phone.trim() 
        });
        
        if (error) {
          console.warn("Erreur RPC recoverCode:", error.message);
          return { found: false };
        }

        if (data) {
          const result = Array.isArray(data) ? data[0] : data;
          if (result && result.found) {
            return { found: true, tracking_code: result.tracking_code };
          }
        }
      } catch (e) {
        console.error("Exception recoverCode:", e);
      }

      return { found: false };
    }
  },

  announcements: {
    getActive: async (): Promise<Announcement | null> => {
      try {
        const { data, error } = await supabase.from('announcements').select('*').eq('active', true).maybeSingle();
        if (error) {
          console.warn("Erreur chargement bannière active:", error);
          return null;
        }
        return data as Announcement;
      } catch (e) {
        console.error("Exception bannière active:", e);
        return null;
      }
    },
    getSettings: async (): Promise<Announcement | null> => {
      try {
        const { data, error } = await supabase.from('announcements').select('*').eq('id', 1).maybeSingle();
        if (error) {
          console.warn("Erreur chargement paramètres bannière:", error);
          return null;
        }
        return data as Announcement;
      } catch (e) {
        console.error("Exception getSettings bannière:", e);
        return null;
      }
    },
    update: async (message: string, type: 'alert' | 'info', active: boolean) => {
      const { error } = await supabase.from('announcements').upsert({ id: 1, message, type, active });
      if (error) {
        console.error("Erreur mise à jour bannière:", error);
        throw error;
      }
    }
  },

  contact: {
    send: async (formData: { name: string; email: string; phone: string; message: string }) => {
      const { error } = await supabase.from('contact_messages').insert([{
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        status: 'unread'
      }]);
      if (error) {
        console.error("Erreur envoi message contact:", error);
        throw error;
      }
      return true;
    },
    getAll: async (): Promise<ContactMessage[]> => {
      try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error("Erreur chargement messages de contact:", error);
          return [];
        }
        return (data || []).map((item: any) => ({ ...item, id: Number(item.id) }));
      } catch (e) {
        console.error("Exception chargement messages contact:", e);
        return [];
      }
    },
    delete: async (id: number) => {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) {
        console.error("Erreur suppression message contact:", error);
        throw error;
      }
      return true;
    }
  }
};
