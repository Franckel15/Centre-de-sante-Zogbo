
import { supabase } from './supabaseClient';
import { BLOG_POSTS, GALLERY_IMAGES } from '../constants';

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
  id: number; // string | number handled in api
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
const getPathFromUrl = (url: string) => {
    if (!url) return null;
    try {
        const parts = url.split('/storage/v1/object/public/');
        if (parts.length > 1) {
            const pathParts = parts[1].split('/');
            pathParts.shift(); 
            return decodeURIComponent(pathParts.join('/'));
        }
        return null;
    } catch (e) { return null; }
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API ---
export const api = {
  system: {
      checkHealth: async (): Promise<boolean> => {
          try {
              const { error } = await supabase.from('site_images').select('key').limit(1).maybeSingle();
              return !error;
          } catch (e) { return false; }
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
            if (attempts >= 3) {
                console.error("Supabase unreachable"); 
                throw e;
            }
            await wait(500 * attempts); 
          }
      }
      return {};
    },
    upload: async (key: string, file: File): Promise<string> => {
        try {
            const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
            const fileName = `site-assets/${key}_${Date.now()}_${cleanName}`;
            
            const { error: upErr } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
            if (upErr) throw upErr;
            
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
            // On retire updated_at par sécurité si la colonne manque aussi ici, sinon on peut le laisser si la table site_images est correcte.
            // Pour l'instant je modifie seulement announcements comme demandé, mais je retire updated_at ici aussi pour prévenir l'erreur.
            const { error: dbErr } = await supabase.from('site_images').upsert({
                key, url: publicUrl
            });
            if (dbErr) throw dbErr;
            return publicUrl;
        } catch (error) { throw error; }
    }
  },

  videos: {
      getAll: async (): Promise<VideoResource[]> => {
          try {
            const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
            return (data || []).map((item: any) => ({
                id: Number(item.id),
                title: item.title,
                url: item.url,
                category: item.category,
                created_at: item.created_at
            }));
          } catch (e) { return []; }
      },
      create: async (meta: { title: string, category?: string }, file: File) => {
          const fileName = `vid_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
          const { error: upErr } = await supabase.storage.from('video-files').upload(fileName, file);
          if (upErr) throw upErr;
          const { data: { publicUrl } } = supabase.storage.from('video-files').getPublicUrl(fileName);
          const { data, error } = await supabase.from('videos').insert([{
              title: meta.title, category: meta.category || 'Général', url: publicUrl
          }]).select().single();
          if (error) throw error;
          return data;
      },
      delete: async (id: number, url: string) => {
          if (url) {
              const path = getPathFromUrl(url);
              if (path) await supabase.storage.from('video-files').remove([path]);
          }
          const { error } = await supabase.from('videos').delete().eq('id', id);
          if (error) throw error;
          return true;
      }
  },

  gallery: {
      getAll: async (): Promise<GalleryImage[]> => {
          try {
              const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
              if (error || !data || data.length === 0) {
                  return GALLERY_IMAGES.map((img, index) => ({
                      id: index + 9999,
                      url: img.url,
                      caption: img.caption,
                      category: img.category
                  }));
              }
              return data.map((item: any) => ({
                  id: Number(item.id),
                  url: item.url,
                  caption: item.caption,
                  category: item.category,
                  created_at: item.created_at
              }));
          } catch (e) {
               return GALLERY_IMAGES.map((img, index) => ({
                  id: index + 9999,
                  url: img.url,
                  caption: img.caption,
                  category: img.category
              }));
          }
      },
      create: async (meta: { caption: string, category: string }, file: File) => {
          const fileName = `gallery_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
          const { error: upErr } = await supabase.storage.from('images').upload(fileName, file);
          if (upErr) throw upErr;
          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
          const { data, error } = await supabase.from('gallery').insert([{
              caption: meta.caption, category: meta.category, url: publicUrl
          }]).select().single();
          if (error) throw error;
          return data;
      },
      delete: async (id: number, url: string) => {
          if (url) {
              const path = getPathFromUrl(url);
              if (path) await supabase.storage.from('images').remove([path]);
          }
          const { error } = await supabase.from('gallery').delete().eq('id', id);
          if (error) throw error;
          return true;
      }
  },

  audios: {
    getAll: async (): Promise<AudioResource[]> => {
      try {
          const { data } = await supabase.from('audios').select('*').order('created_at', { ascending: false });
          return (data || []).map((item: any) => ({
            id: Number(item.id),
            title: item.title,
            serviceName: item.service_name,
            url: item.url,
            description: item.description,
            created_at: item.created_at
          }));
      } catch (e) { return []; }
    },
    create: async (meta: any, file: File) => {
        const fileName = `aud_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from('audio-files').upload(fileName, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('audio-files').getPublicUrl(fileName);
        const { data, error } = await supabase.from('audios').insert([{
            title: meta.title, service_name: meta.serviceName, description: meta.description, url: publicUrl
        }]).select().single();
        if (error) throw error;
        return data;
    },
    update: async (id: number, meta: any, file?: File) => {
        const updates: any = { title: meta.title, service_name: meta.serviceName, description: meta.description };
        if (file) {
            const fileName = `aud_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
            await supabase.storage.from('audio-files').upload(fileName, file);
            const { data } = supabase.storage.from('audio-files').getPublicUrl(fileName);
            updates.url = data.publicUrl;
        }
        const { data, error } = await supabase.from('audios').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    delete: async (id: number, url: string) => {
        if (url) {
            const path = getPathFromUrl(url);
            if (path) await supabase.storage.from('audio-files').remove([path]);
        }
        const { error } = await supabase.from('audios').delete().eq('id', id);
        if (error) throw error;
        return true;
    }
  },

  blog: {
    getAll: async (): Promise<BlogPost[]> => {
      try {
          const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
          if (error || !data) return BLOG_POSTS.map((p,i) => ({...p, created_at: new Date().toISOString(), id: p.id || i+1000}));
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
      } catch (e) { return BLOG_POSTS.map((p,i) => ({...p, created_at: new Date().toISOString(), id: p.id || i+1000})); }
    },
    create: async (meta: any, file: File) => {
        const fileName = `blog_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from('images').upload(fileName, file);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        const { data, error } = await supabase.from('posts').insert([{
            title: meta.title, excerpt: meta.excerpt, category: 'Actualité', service: meta.service, image: publicUrl
        }]).select().single();
        if (error) throw error;
        return data;
    },
    getById: async (id: number): Promise<BlogPost | null> => {
        try {
            const { data } = await supabase.from('posts').select('*').eq('id', id).single();
            if (!data) return BLOG_POSTS.find(p => p.id === id) as any || null;
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
        } catch (e) { return BLOG_POSTS.find(p => p.id === id) as any || null; }
    },
    update: async (id: number, meta: any, file?: File) => {
        const updates: any = { title: meta.title, excerpt: meta.excerpt, service: meta.service };
        if (file) {
             const fileName = `blog_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
             await supabase.storage.from('images').upload(fileName, file);
             const { data } = supabase.storage.from('images').getPublicUrl(fileName);
             updates.image = data.publicUrl;
        }
        const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    delete: async (id: number, imageUrl?: string) => {
        if (imageUrl) {
            const path = getPathFromUrl(imageUrl);
            if (path) await supabase.storage.from('images').remove([path]);
        }
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw error;
        return true;
    }
  },

  appointments: {
    create: async (formData: any) => {
        // 1. Sauvegarde en base de données Supabase
        let dbError = null;
        try {
            const { error } = await supabase.from('appointments').insert([{...formData, status: 'pending'}]);
            if (error) dbError = error;
        } catch(e) { dbError = e; }
        
        // 2. Sauvegarde locale de secours ROBUSTE
        try {
            let localApps = [];
            try {
                const stored = localStorage.getItem('local_appointments');
                if (stored) localApps = JSON.parse(stored);
                // Si corruption (ex: ce n'est pas un tableau), on réinitialise
                if (!Array.isArray(localApps)) localApps = [];
            } catch(e) { 
                localApps = []; 
            }

            localApps.push({
                ...formData,
                status: 'pending',
                created_at: new Date().toISOString()
            });
            localStorage.setItem('local_appointments', JSON.stringify(localApps));
        } catch (e) { console.error("Local storage error", e); }

        if (dbError) console.warn("Supabase insert error (using local fallback)", dbError);
        return true;
    },
    getAll: async (): Promise<Appointment[]> => {
        try {
            const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
            return (data || []).map(d => ({ ...d, id: Number(d.id) })) as Appointment[];
        } catch (e) { return []; }
    },
    delete: async (id: number) => {
        const { error } = await supabase.from('appointments').delete().eq('id', id);
        if (error) throw error;
        return true;
    },
    updateStatus: async (id: number, status: any) => {
        const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
        if (error) throw error;
        return true;
    },
    checkStatus: async (code: string) => {
        const normalizedCode = code.trim().toUpperCase();

        // 1. Essayer via RPC (Méthode sécurisée serveur)
        const { data, error } = await supabase.rpc('get_appointment_status_by_code', { code_input: normalizedCode });
        
        if (!error && data && data.found) {
            return data;
        }

        // 2. Fallback: Essai via Select direct
        try {
            const { data: directData } = await supabase
                .from('appointments')
                .select('status, date, time')
                .eq('tracking_code', normalizedCode)
                .maybeSingle();

            if (directData) {
                return {
                    found: true,
                    status: directData.status,
                    rdv_date: directData.date,
                    rdv_time: directData.time
                };
            }
        } catch(e) { /* ignore */ }

        // 3. Fallback Ultime: Local Storage
        try {
             const stored = localStorage.getItem('local_appointments');
             if (stored) {
                 const localApps = JSON.parse(stored);
                 if (Array.isArray(localApps)) {
                     const found = localApps.find((a: any) => 
                        a.tracking_code && a.tracking_code.trim().toUpperCase() === normalizedCode
                     );
                     
                     if (found) {
                         return {
                             found: true,
                             status: found.status,
                             rdv_date: found.date,
                             rdv_time: found.time
                         };
                     }
                 }
             }
        } catch(e) {}

        return { found: false };
    },
    recoverCode: async (name: string, phone: string) => {
        const cleanPhone = phone.replace(/\s/g, '');
        
        // 1. Essayer via RPC
        const { data, error } = await supabase.rpc('recover_appointment_code', { name_input: name, phone_input: phone });
        if (!error && data && data.found) return data;

        // 2. Fallback Direct Select
        try {
            const { data: directData } = await supabase
                .from('appointments')
                .select('tracking_code')
                .ilike('name', name)
                .or(`phone.eq.${phone},phone.eq.${cleanPhone}`)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (directData) {
                return { found: true, tracking_code: directData.tracking_code };
            }
        } catch(e) { /* ignore */ }

        // 3. Fallback Local Storage
        try {
            const stored = localStorage.getItem('local_appointments');
            if (stored) {
                const localApps = JSON.parse(stored);
                if (Array.isArray(localApps)) {
                    // Recherche insensible à la casse
                    const found = localApps.reverse().find((a: any) => 
                        a.name && a.name.toLowerCase() === name.toLowerCase() && 
                        a.phone && a.phone.replace(/\s/g, '') === cleanPhone
                    );
                    if (found && found.tracking_code) {
                        return { found: true, tracking_code: found.tracking_code };
                    }
                }
            }
        } catch (e) {}

        return { found: false };
    }
  },

  announcements: {
    // Méthode pour le site public : ne renvoie que si actif
    getActive: async (): Promise<Announcement | null> => {
      try {
        const { data } = await supabase.from('announcements').select('*').eq('active', true).maybeSingle();
        return data as Announcement;
      } catch (e) { return null; }
    },
    // Méthode pour l'admin : renvoie la ligne ID 1 quoi qu'il arrive
    getSettings: async (): Promise<Announcement | null> => {
        try {
            const { data } = await supabase.from('announcements').select('*').eq('id', 1).maybeSingle();
            return data as Announcement;
        } catch (e) { return null; }
    },
    update: async (message: string, type: 'alert' | 'info', active: boolean) => {
        // CORRECTION: Suppression de updated_at car la colonne n'existe pas
        const { error } = await supabase.from('announcements').upsert({ id: 1, message, type, active });
        if (error) throw error;
    }
  },

  contact: {
    send: async (formData: any) => {
      const { error } = await supabase.from('contact_messages').insert([{...formData, status: 'unread'}]);
      if (error) throw error;
      return true;
    },
    getAll: async (): Promise<ContactMessage[]> => {
      try {
        const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        return (data || []).map((item: any) => ({ ...item, id: Number(item.id) }));
      } catch (e) { return []; }
    },
    delete: async (id: number) => {
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (error) throw error;
        return true;
    }
  }
};
