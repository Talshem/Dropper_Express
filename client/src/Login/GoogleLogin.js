import GoogleLogin from 'react-google-login';
import { useContext } from "react";
import { UserContext } from "../Providers/UserProvider";
import { TYPE } from './'

export default function GoogleButton() {
  const { userLogin } = useContext(UserContext);

return (
  <GoogleLogin className="signGoogle"
clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
buttonText="Sign In With Google"
onSuccess={(response) => userLogin({type:TYPE.GOOGLE, email:response.xt.du, name:response.xt.Ad})}
onFailure={(response) => console.log(response)}
cookiePolicy={'single_host_origin'}
/>
)}