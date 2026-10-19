import VinHome from './VinHome'
import Demo from './Demo'
export default function App(){return window.location.pathname === '/demo' ? <Demo/> : <VinHome/>}
