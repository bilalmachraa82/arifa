-- Promover Bilal Machraa a admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '4aa5dc99-a855-4fa8-9134-d387af6a6aa9';

-- Criar função para promover utilizadores a admin (apenas admins podem usar)
CREATE OR REPLACE FUNCTION public.promote_to_admin(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Only existing admins can promote others
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem promover utilizadores';
  END IF;
  
  -- Get user_id from profiles by email
  SELECT id INTO _user_id FROM profiles WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Utilizador não encontrado';
  END IF;
  
  -- Update role to admin
  UPDATE user_roles SET role = 'admin' WHERE user_id = _user_id;
END;
$$;

-- Criar função para despromover utilizadores (remover admin)
CREATE OR REPLACE FUNCTION public.demote_from_admin(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid;
BEGIN
  -- Only existing admins can demote others
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Apenas administradores podem despromover utilizadores';
  END IF;
  
  -- Get user_id from profiles by email
  SELECT id INTO _user_id FROM profiles WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Utilizador não encontrado';
  END IF;
  
  -- Update role back to client
  UPDATE user_roles SET role = 'client' WHERE user_id = _user_id;
END;
$$;