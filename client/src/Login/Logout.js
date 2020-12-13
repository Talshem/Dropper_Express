import { GoogleLogout } from 'react-google-login';
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
  
export default function GoogleButton() {
  const { userLogout, user } = useContext(UserContext);

return (
<>
{ user.type === 'google' ?
  <GoogleLogout className="signGoogle"
clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
buttonText="Logout"
onLogoutSuccess={() => userLogout()}
/>
:
<button onClick={() => userLogout()}> Logout </button>}
</>
)}