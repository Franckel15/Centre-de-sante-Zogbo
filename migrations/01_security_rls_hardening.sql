-- ==============================================================================
-- CENTRE DE SANTÉ DE ZOGBO - MIGRATION DE SÉCURISATION ROW LEVEL SECURITY (RLS)
-- Fichier : migrations/01_security_rls_hardening.sql
-- Description : Verrouillage strict des accès en lecture/écriture sur PostgreSQL.
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. PROTECTION DE LA TABLE 'appointments' (Données médicales hautement sensibles)
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;

-- Supprimer d'anciennes politiques permissives éventuelles
DROP POLICY IF EXISTS "Enable all access for all users" ON appointments;
DROP POLICY IF EXISTS "Public can view appointments" ON appointments;
DROP POLICY IF EXISTS "Public read appointments" ON appointments;
DROP POLICY IF EXISTS "Permettre création rdv public" ON appointments;
DROP POLICY IF EXISTS "Lecture rdv admin uniquement" ON appointments;
DROP POLICY IF EXISTS "Modification rdv admin uniquement" ON appointments;
DROP POLICY IF EXISTS "Suppression rdv admin uniquement" ON appointments;

-- RÈGLE 1 : Les visiteurs anonymes et utilisateurs peuvent UNIQUEMENT créer un rendez-vous (INSERT)
CREATE POLICY "Permettre création rdv public"
ON appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- RÈGLE 2 : SEULS les administrateurs connectés (rôle 'authenticated') peuvent LIRE les rendez-vous
CREATE POLICY "Lecture rdv admin uniquement"
ON appointments FOR SELECT
TO authenticated
USING (true);

-- RÈGLE 3 : SEULS les administrateurs connectés peuvent MODIFIER (ex: confirmer statut)
CREATE POLICY "Modification rdv admin uniquement"
ON appointments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- RÈGLE 4 : SEULS les administrateurs connectés peuvent SUPPRIMER des rendez-vous
CREATE POLICY "Suppression rdv admin uniquement"
ON appointments FOR DELETE
TO authenticated
USING (true);


-- ------------------------------------------------------------------------------
-- 2. PROTECTION DE LA TABLE 'contact_messages' (Correspondance privée des usagers)
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS contact_messages ENABLE ROW LEVEL SECURITY;

-- Supprimer d'anciennes politiques permissives
DROP POLICY IF EXISTS "Enable all access for all users" ON contact_messages;
DROP POLICY IF EXISTS "Public read contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Permettre envoi message contact public" ON contact_messages;
DROP POLICY IF EXISTS "Lecture messages admin uniquement" ON contact_messages;
DROP POLICY IF EXISTS "Modification messages admin uniquement" ON contact_messages;
DROP POLICY IF EXISTS "Suppression messages admin uniquement" ON contact_messages;

-- RÈGLE 1 : Les visiteurs anonymes peuvent UNIQUEMENT envoyer un message (INSERT)
CREATE POLICY "Permettre envoi message contact public"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- RÈGLE 2 : SEULS les administrateurs connectés peuvent LIRE les messages
CREATE POLICY "Lecture messages admin uniquement"
ON contact_messages FOR SELECT
TO authenticated
USING (true);

-- RÈGLE 3 : SEULS les administrateurs connectés peuvent marquer comme lu (UPDATE)
CREATE POLICY "Modification messages admin uniquement"
ON contact_messages FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- RÈGLE 4 : SEULS les administrateurs connectés peuvent supprimer des messages (DELETE)
CREATE POLICY "Suppression messages admin uniquement"
ON contact_messages FOR DELETE
TO authenticated
USING (true);


-- ------------------------------------------------------------------------------
-- 3. PROTECTION DU CONTENU PUBLIC DU SITE (posts, gallery, audios, videos, etc.)
-- Lecture publique, modifications réservées aux administrateurs
-- ------------------------------------------------------------------------------

-- Table 'posts' (Articles de blog / Actualités)
ALTER TABLE IF EXISTS posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique posts" ON posts;
DROP POLICY IF EXISTS "Gestion admin posts" ON posts;
CREATE POLICY "Lecture publique posts" ON posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestion admin posts" ON posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 'gallery'
ALTER TABLE IF EXISTS gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique gallery" ON gallery;
DROP POLICY IF EXISTS "Gestion admin gallery" ON gallery;
CREATE POLICY "Lecture publique gallery" ON gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestion admin gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 'audios'
ALTER TABLE IF EXISTS audios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique audios" ON audios;
DROP POLICY IF EXISTS "Gestion admin audios" ON audios;
CREATE POLICY "Lecture publique audios" ON audios FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestion admin audios" ON audios FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 'videos'
ALTER TABLE IF EXISTS videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique videos" ON videos;
DROP POLICY IF EXISTS "Gestion admin videos" ON videos;
CREATE POLICY "Lecture publique videos" ON videos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestion admin videos" ON videos FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 'site_images'
ALTER TABLE IF EXISTS site_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique site_images" ON site_images;
DROP POLICY IF EXISTS "Gestion admin site_images" ON site_images;
CREATE POLICY "Lecture publique site_images" ON site_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestion admin site_images" ON site_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Table 'announcements'
ALTER TABLE IF EXISTS announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lecture publique announcements" ON announcements;
DROP POLICY IF EXISTS "Gestion admin announcements" ON announcements;
CREATE POLICY "Lecture publique announcements" ON announcements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestion admin announcements" ON announcements FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 4. FONCTION SÉCURISÉE DE VÉRIFICATION DE STATUT PAR CODE DE SUIVI
-- Ne retourne QUE le statut et la date/heure sans JAMAIS exposer les données du patient
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS get_appointment_status_by_code(TEXT);

CREATE OR REPLACE FUNCTION get_appointment_status_by_code(code_input TEXT)
RETURNS TABLE (
  found BOOLEAN,
  status TEXT,
  rdv_date TEXT,
  rdv_time TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true AS found,
    a.status::TEXT,
    a.date::TEXT AS rdv_date,
    a.time::TEXT AS rdv_time
  FROM appointments a
  WHERE UPPER(TRIM(a.tracking_code)) = UPPER(TRIM(code_input))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT, NULL::TEXT, NULL::TEXT;
  END IF;
END;
$$;

-- Rendre la fonction accessible aux usagers anonymes
GRANT EXECUTE ON FUNCTION get_appointment_status_by_code(TEXT) TO anon, authenticated;


-- ------------------------------------------------------------------------------
-- 5. FONCTION SÉCURISÉE DE RÉCUPÉRATION DU CODE DE SUIVI
-- Vérifie strictement la correspondance exacte du nom et du téléphone
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS recover_appointment_code(TEXT, TEXT);

CREATE OR REPLACE FUNCTION recover_appointment_code(name_input TEXT, phone_input TEXT)
RETURNS TABLE (
  found BOOLEAN,
  tracking_code TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true AS found,
    a.tracking_code::TEXT
  FROM appointments a
  WHERE LOWER(TRIM(a.name)) = LOWER(TRIM(name_input))
    AND REPLACE(a.phone, ' ', '') = REPLACE(phone_input, ' ', '')
  ORDER BY a.created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::TEXT;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION recover_appointment_code(TEXT, TEXT) TO anon, authenticated;


-- ------------------------------------------------------------------------------
-- 6. SÉCURISATION DU STOCKAGE SUPABASE (storage.objects)
-- Seuls les administrateurs connectés peuvent téléverser, modifier ou supprimer des fichiers
-- ------------------------------------------------------------------------------
-- Lecture publique des fichiers médias des buckets du centre
DROP POLICY IF EXISTS "Public Access images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete images" ON storage.objects;

CREATE POLICY "Public Access images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id IN ('images', 'audio-files', 'video-files'));

CREATE POLICY "Admin Upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('images', 'audio-files', 'video-files'));

CREATE POLICY "Admin Update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('images', 'audio-files', 'video-files'));

CREATE POLICY "Admin Delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('images', 'audio-files', 'video-files'));

COMMIT;
