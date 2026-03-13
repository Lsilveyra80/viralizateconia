/*
  # Agregar tabla de títulos guardados

  1. Nueva tabla
    - `saved_titles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key a auth.users)
      - `nicho` (text)
      - `estilo_video` (text)
      - `titulo` (text)
      - `created_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en tabla saved_titles
    - Políticas para que usuarios solo vean sus propios títulos
*/

CREATE TABLE IF NOT EXISTS saved_titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nicho text NOT NULL,
  estilo_video text NOT NULL,
  titulo text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_titles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own titles" ON saved_titles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own titles" ON saved_titles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own titles" ON saved_titles FOR DELETE TO authenticated USING (auth.uid() = user_id);
