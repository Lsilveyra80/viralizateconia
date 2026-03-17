const signUp = async (email: string, password: string, name?: string) => {
  try {
    // 1. Registrar al usuario en Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || '',
        }
      }
    });

    if (authError) throw authError;

    // 2. Si el registro fue exitoso, llamar a Vercel para enviar el email con Resend
    if (authData.user) {
      const response = await fetch('/api/send-welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name || ''
        }),
      });

      const emailResult = await response.json();
      
      if (!emailResult.success) {
        console.warn('El usuario se creó, pero hubo un error al enviar el correo:', emailResult.error);
      }
    }

  } catch (error) {
    console.error('Error durante el registro:', error);
    throw error;
  }
};
