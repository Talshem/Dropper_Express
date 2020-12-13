import GoogleLogin from 'react-google-login';
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
  
export default function GoogleButton() {
  const { userLogin, loginResponse } = useContext(UserContext);

return (
  <GoogleLogin className="signGoogle"
clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
buttonText="Sign In With Google"
onSuccess={(response) => userLogin('google', response.xt.du)}
onFailure={(response) => console.log(response)}
cookiePolicy={'single_host_origin'}
isSignedIn={true}
/>
)}