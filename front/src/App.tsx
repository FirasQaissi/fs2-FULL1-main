import Default from "./layouts/default";
import WhatsAppPopup from "./components/WhatsAppPopup";
import LoadingScreen from "./components/LoadingScreen";
import TokenExpirationHandler from "./components/TokenExpirationHandler";



function App() {
 return (
  <TokenExpirationHandler>
    <LoadingScreen />
    <Default />
    <WhatsAppPopup />
  </TokenExpirationHandler>
 )
}

export default App;
