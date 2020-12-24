import { GoogleLogout } from 'react-google-login';
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import { Button } from '@material-ui/core';
import { TYPE } from './'

export default function GoogleButton() {
  const { userLogout, user } = useContext(UserContext);

return (
<>
{ user.type === TYPE.GOOGLE ?
  <GoogleLogout className="signGoogle"
clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
buttonText="Logout"
render={renderProps => (
      <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>Logout</Button>
    )}
onLogoutSuccess={() => userLogout()}
/>
:
<Button onClick={() => userLogout()}> Logout </Button>}
</>
)}