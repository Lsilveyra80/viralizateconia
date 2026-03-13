/*
  # Esquema ViralGenius

  1. Tablas
    - user_profiles: Perfiles de usuario
    - saved_ideas: Ideas guardadas
    - saved_scripts: Guiones guardados

  2. Seguridad
    - RLS habilitado
    - Políticas por usuario
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  daily_searches integer NOT NULL DEFAULT 0,
  last_search_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS saved_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nicho text NOT NULL,
  estilo text NOT NULL,
  idea text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ideas" ON saved_ideas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ideas" ON saved_ideas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON saved_ideas FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS saved_scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  duracion text NOT NULL,
  tono text NOT NULL,
  contenido text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scripts" ON saved_scripts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scripts" ON saved_scripts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scripts" ON saved_scripts FOR DELETE TO authenticated USING (auth.uid() = user_id);