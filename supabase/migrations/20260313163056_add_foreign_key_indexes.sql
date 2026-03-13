/*
  # Agregar índices para claves foráneas

  1. Nuevos índices
    - Índice en `user_profiles.id` para mejorar performance de búsquedas por usuario
    - Índice en `saved_ideas.user_id` para mejorar performance de consultas
    - Índice en `saved_scripts.user_id` para mejorar performance de consultas
    - Índice en `saved_titles.user_id` para mejorar performance de consultas

  2. Beneficios
    - Mejor rendimiento en consultas que filtran por user_id
    - Optimización de JOIN operations
    - Mejora en la ejecución de políticas RLS
*/

CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_saved_ideas_user_id ON saved_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_scripts_user_id ON saved_scripts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_titles_user_id ON saved_titles(user_id);
