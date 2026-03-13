/*
  # Optimizar políticas RLS

  1. Cambios
    - Reemplazar todas las políticas RLS para usar (select auth.uid()) en lugar de auth.uid()
    - Esto previene la re-evaluación de auth.uid() para cada fila
    - Mejora significativa en el rendimiento de consultas a gran escala

  2. Tablas afectadas
    - user_profiles: 3 políticas optimizadas
    - saved_ideas: 3 políticas optimizadas
    - saved_scripts: 3 políticas optimizadas
    - saved_titles: 3 políticas optimizadas

  3. Notas
    - Esta optimización es especialmente importante para consultas que escanean múltiples filas
    - El valor de auth.uid() se calcula una sola vez por consulta en lugar de por cada fila
*/

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can view own ideas" ON saved_ideas;
DROP POLICY IF EXISTS "Users can insert own ideas" ON saved_ideas;
DROP POLICY IF EXISTS "Users can delete own ideas" ON saved_ideas;

CREATE POLICY "Users can view own ideas"
  ON saved_ideas FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own ideas"
  ON saved_ideas FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own ideas"
  ON saved_ideas FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own scripts" ON saved_scripts;
DROP POLICY IF EXISTS "Users can insert own scripts" ON saved_scripts;
DROP POLICY IF EXISTS "Users can delete own scripts" ON saved_scripts;

CREATE POLICY "Users can view own scripts"
  ON saved_scripts FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own scripts"
  ON saved_scripts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own scripts"
  ON saved_scripts FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view own titles" ON saved_titles;
DROP POLICY IF EXISTS "Users can insert own titles" ON saved_titles;
DROP POLICY IF EXISTS "Users can delete own titles" ON saved_titles;

CREATE POLICY "Users can view own titles"
  ON saved_titles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own titles"
  ON saved_titles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own titles"
  ON saved_titles FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);
