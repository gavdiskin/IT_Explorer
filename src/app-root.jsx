import { useState, useEffect } from 'react';
import { useRoute } from './router';
import { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio } from './tweaks-panel';
import { useAuth, Header, MobileDrawer, MobileBottomNav, Footer } from './shell';
import { HomePage } from './pages/home';
import { MapPage } from './pages/map';
import { PlacePage, NotFound } from './pages/place';
import { CategoryPage, CityPage, StationPage, GuidesPage, TransportPage } from './pages/discovery';
import { ToolsHubPage, ScamDetectorPage, PriceCheckerPage, PhrasebookPage, EmergencyPage, SimFinderPage } from './pages/tools';
import { SavedPage, SubmitPage, AccountPage, SignInPage } from './pages/account';

const TWEAK_DEFAULTS = {
  homeLayout: 'hub',
  mapLayout: 'floating',
  showCannabis: false,
  signedIn: false,
};

export function App() {
  const route = useRoute();
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const auth = useAuth(tweaks.signedIn);
  const [city, setCity] = useState('bangkok');
  const [savedSet, setSavedSet] = useState(() => new Set(['or-tor-kor', 'wat-arun']));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('has-bottomnav');
    return () => document.body.classList.remove('has-bottomnav');
  }, []);

  useEffect(() => {
    if (tweaks.signedIn !== auth.signedIn) {
      if (tweaks.signedIn) auth.signIn(); else auth.signOut();
    }
  }, [tweaks.signedIn]);

  const toggleSave = (id) => setSavedSet(s => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const noFooter = route.name === 'map';

  return (
    <>
      <Header auth={auth} route={route} city={city} setCity={setCity} onMenu={() => setDrawerOpen(true)}/>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} auth={auth} city={city} setCity={setCity}/>
      <Routed route={route} city={city} setCity={setCity} auth={auth} tweaks={tweaks} savedSet={savedSet} onToggleSave={toggleSave}/>
      {!noFooter && <Footer/>}
      <MobileBottomNav route={route}/>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Home layout"/>
        <TweakRadio label="Variant" value={tweaks.homeLayout} options={['hub', 'mapfirst', 'editorial']} onChange={v => setTweak('homeLayout', v)}/>
        <TweakSection label="Map layout"/>
        <TweakRadio label="Variant" value={tweaks.mapLayout} options={['split', 'floating', 'drawer']} onChange={v => setTweak('mapLayout', v)}/>
        <TweakSection label="Account state"/>
        <TweakToggle label="Signed in" value={auth.signedIn} onChange={v => { setTweak('signedIn', v); v ? auth.signIn() : auth.signOut(); }}/>
        <TweakSection label="Categories"/>
        <TweakToggle label="Show cannabis shops" value={tweaks.showCannabis} onChange={v => setTweak('showCannabis', v)}/>
      </TweaksPanel>
    </>
  );
}

function Routed({ route, city, setCity, auth, tweaks, savedSet, onToggleSave }) {
  const common = { route, city, setCity, auth, tweaks, savedSet, onToggleSave };
  switch (route.name) {
    case 'home':              return <HomePage           {...common}/>;
    case 'map':               return <MapPage            {...common}/>;
    case 'place':             return <PlacePage          {...common}/>;
    case 'category':          return <CategoryPage       {...common}/>;
    case 'city':              return <CityPage           {...common}/>;
    case 'station':           return <StationPage        {...common}/>;
    case 'guides':
    case 'guide':             return <GuidesPage         {...common}/>;
    case 'transport':         return <TransportPage      {...common}/>;
    case 'tools':             return <ToolsHubPage       {...common}/>;
    case 'tools-scams':       return <ScamDetectorPage   {...common}/>;
    case 'tools-prices':      return <PriceCheckerPage   {...common}/>;
    case 'tools-phrasebook':  return <PhrasebookPage     {...common}/>;
    case 'tools-emergency':   return <EmergencyPage      {...common}/>;
    case 'tools-sim':         return <SimFinderPage      {...common}/>;
    case 'saved':             return <SavedPage          {...common}/>;
    case 'submit':            return <SubmitPage         {...common}/>;
    case 'account':           return <AccountPage        {...common}/>;
    case 'signin':            return <SignInPage         {...common}/>;
    default:                  return <NotFound title="404" subtitle="That page isn't here."/>;
  }
}
