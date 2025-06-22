import { Button } from '@mui/material';
import { Google } from '@mui/icons-material';

export default function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
  };

  return (
    <Button
      variant="contained"
      startIcon={<Google />}
      onClick={handleLogin}
      sx={{
        backgroundColor: '#4285F4',
        '&:hover': { backgroundColor: '#357ABD' }
      }}
    >
      Login with Google
    </Button>
  );
}