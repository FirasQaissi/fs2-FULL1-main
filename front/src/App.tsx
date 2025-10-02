import Default from "./layouts/default";
import WhatsAppPopup from "./components/WhatsAppPopup";
import CouponBar from "./components/CouponBar";
import LoadingScreen from "./components/LoadingScreen";
import TokenExpirationHandler from "./components/TokenExpirationHandler";



function App() {
 return (
  <TokenExpirationHandler>
    <LoadingScreen />
    <CouponBar />
    <Default />
    <WhatsAppPopup />
  </TokenExpirationHandler>
 )
}

export default App;
