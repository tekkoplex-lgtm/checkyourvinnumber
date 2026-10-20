import { ConvexHttpClient } from 'convex/browser'
import { useEffect, useState } from 'react'
import { VehicleCheckIcon } from './components/VehicleCheckIcon'

export default VinHome

const vinClient = new ConvexHttpClient('https://tacit-scorpion-614.eu-west-1.convex.cloud')
const SAMPLE_VIN = 'AHTKB3CD0K0000002'
const SAMPLE_PLATE = 'DEMO4X4'
const example = {
  model: 'Toyota Hilux 4x4',
  year: '2019',
  vin: SAMPLE_VIN,
  plate: SAMPLE_PLATE,
  location: 'Ghana · Example vehicle',
}


function AddToHomeScreen({ searchCompleted }: { searchCompleted: boolean }) {
  const [visible, setVisible] = useState(false)
  const [inSafari, setInSafari] = useState(true)
  useEffect(() => {
    if (!searchCompleted) return
    const ua = navigator.userAgent
    const ios = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
    const safari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|DuckDuckGo/i.test(ua)
    setInSafari(safari)
    if (!ios || standalone) return
    let seen = false
    try { seen = localStorage.getItem('cyvn-ios-install-tip-v2') === 'seen' } catch { /* ignore */ }
    if (seen) return
    const timer = window.setTimeout(() => setVisible(true), 10000)
    return () => window.clearTimeout(timer)
  }, [searchCompleted])
  function dismiss() {
    setVisible(false)
    try { localStorage.setItem('cyvn-ios-install-tip-v2', 'seen') } catch { /* storage unavailable */ }
  }
  if (!visible) return null
  return <div className="vin-install-backdrop" role="presentation" onClick={dismiss}>
    <section className="vin-install-modal" role="dialog" aria-modal="true" aria-labelledby="vin-install-title" onClick={e => e.stopPropagation()}>
      <button className="vin-install-close" type="button" aria-label="Close guide" onClick={dismiss}>×</button>
      <div className="vin-install-brand"><span>✓</span> CheckYour<strong>VIN</strong>Number</div>
      <div className="vin-install-badge">IPHONE GUIDE</div>
      <h2 id="vin-install-title">Save us to your Home Screen</h2>
      <p className="vin-install-lead">Get back to CheckYourVINNumber in one tap — just like an app. No download needed.</p>
      {!inSafari && <div className="vin-install-safari-note"><strong>First, open in Safari.</strong> Tap the browser menu and choose “Open in Safari”, or copy this page's link into Safari.</div>}
      <ol className="vin-install-steps">
        <li><span className="vin-install-step-icon">⇧</span><div><strong>1. Tap Share</strong><p>In Safari, tap the Share icon <b>□↑</b> in the toolbar.</p></div></li>
        <li><span className="vin-install-step-icon">＋</span><div><strong>2. Add to Home Screen</strong><p>Scroll down in the Share menu and select <b>“Add to Home Screen”.</b></p></div></li>
        <li><span className="vin-install-step-icon">✓</span><div><strong>3. Tap Add</strong><p>Confirm in the top-right corner. The shortcut will appear on your iPhone.</p></div></li>
      </ol>
      <button type="button" className="vin-install-done" onClick={dismiss}>Got it, thanks! ✓</button>
      <p className="vin-install-note">This guide appears after your first vehicle search on iPhone.</p>
    </section>
  </div>
}

function VinHome() {
  const [live, setLive] = useState<{vin:string;year:string|null;make:string|null;model:string|null;trim:string|null;bodyStyle:string|null;drivetrain:string|null;fuel:string|null;transmission:string|null;engine:string|null;source:string}|null>(null)
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<'vin' | 'plate'>('vin')
  const [query, setQuery] = useState('')
  const [report, setReport] = useState(false)
  const [searchCompleted, setSearchCompleted] = useState(false)
  const [error, setError] = useState('')
  const [active, setActive] = useState<'theft' | 'mileage' | 'damage' | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const value = query.trim().toUpperCase().replace(/\\s+/g, '')
    if (method === 'plate') { setError('License plate searches are not connected yet. Please enter a 17-character VIN.'); return }
    if (value === SAMPLE_VIN) { setLive(null); setReport(true); setSearchCompleted(true); setError(''); setActive(null); window.scrollTo({top:0,behavior:'smooth'}); return }
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(value)) { setError('Please enter a valid 17-character VIN.'); return }
    setLoading(true); setError(''); setLive(null)
    try {
      const result = await vinClient.action('vehicle:decodeVin' as any, {vin:value})
      setLive(result); setReport(false); setSearchCompleted(true)
    } catch (err) { setError(err instanceof Error ? err.message.replace(/^.*Uncaught Error: /s,'').slice(0,220) : 'Vehicle lookup unavailable. Please try again.') }
    finally { setLoading(false) }
  }

  function useExample() {
    setMethod('vin')
    setQuery(SAMPLE_VIN)
    setError('')
  }

  return <div className="vin-app"><AddToHomeScreen searchCompleted={searchCompleted} />
    <header className="vin-header">
      <a className="vin-logo" href="/" onClick={e => { e.preventDefault(); setReport(false); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <span className="vin-logo-symbol">✓</span>
        <span>CheckYour<span className="vin-logo-blue">VIN</span>Number</span>
      </a>
      <div className="vin-header-right"><span className="vin-demo-label">INTERACTIVE CONCEPT DEMO</span><button type="button" onClick={() => { setReport(false); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{report ? '← New check' : 'Home'}</button></div>
    </header>

    {!report ? <main>
      <section className="vin-hero">
        <div className="vin-hero-inner">
          <div className="vin-overline"><span className="vin-green-dot" /> YOUR NEXT CAR DESERVES A CLOSER LOOK</div>
          <h1>Know the car.<br/><span>Before you buy.</span></h1>
          <p className="vin-hero-sub">Check the story behind the vehicle you’re about to buy, one simple report. Explore theft, mileage and accident history — all in one place.</p>
          <div className="vin-search-panel" id="check">
            <div className="vin-search-tabs" role="tablist" aria-label="Search type">
              <button type="button" role="tab" aria-selected={method === 'vin'} className={method === 'vin' ? 'selected' : ''} onClick={() => { setMethod('vin'); setError('') }}>VIN number</button>
              <button type="button" role="tab" aria-selected={method === 'plate'} className={method === 'plate' ? 'selected' : ''} onClick={() => { setMethod('plate'); setError('') }}>License plate</button>
            </div>
            <form onSubmit={submit}>
              <div className="vin-search-input-wrap">
                <span className="vin-input-icon">⌕</span>
                <input aria-label={method === 'vin' ? 'VIN number' : 'License plate'} value={query} onChange={e => { setQuery(e.target.value.toUpperCase()); setError('') }} placeholder={method === 'vin' ? 'Enter 17-character VIN number' : 'Enter license plate number'} maxLength={method === 'vin' ? 17 : 16} autoComplete="off" />
                <button type="submit" disabled={loading}>{loading ? "Checking..." : "Check vehicle"} <span>→</span></button>
              </div>
            </form>
            {error && <div className="vin-search-error" role="alert">{error}</div>}
            {live && <section role="status" style={{padding:20,background:'#ecfdf5',border:'1px solid #86efac',borderRadius:14,marginTop:16,color:'#12372a'}}><strong>REAL VIN IDENTITY RESULT</strong><h2 style={{margin:'10px 0'}}>{[live.year,live.make,live.model].filter(Boolean).join(' ')}</h2><p>VIN: {live.vin}</p><p>{[live.trim,live.bodyStyle,live.drivetrain,live.fuel,live.transmission,live.engine].filter(Boolean).join(' · ')}</p><small>Source: {live.source}. Vehicle identity only. Theft, accident and mileage history have NOT been checked.</small></section>}
            <div className="vin-search-example"><span>TRY A FREE SAMPLE</span><button type="button" onClick={useExample}>{SAMPLE_VIN} <span>↗</span></button></div>
          </div>
          <div className="vin-hero-foot"><span>◇ No account needed for demo</span><span>◈ 3 essential checks</span><span>◎ Mobile-friendly report</span></div>
        </div>
        <div className="vin-hero-art" aria-hidden="true"><div className="vin-hero-art-glow"/><img src="https://assets.macaly-user-data.dev/cdn-cgi/image/format=webp,width=2000,height=2000,fit=scale-down,quality=85,anim=false/hk7vbisnfqwoghpqo5sykxw5/ijm16fx7vhseth1zvjh6drna/vTjXoF66lSSozBg1FgNXy.jpeg" alt="" /><div className="vin-hero-art-shade"/><div className="vin-floating-result"><span className="vin-floating-icon">✓</span><div><strong>Vehicle history</strong><small>One clear overview</small></div></div></div>
      </section>
      <section className="vin-three-checks">
        <div className="vin-section-intro"><span className="vin-eyebrow">EVERYTHING THAT MATTERS</span><h2>Three checks. <span>One confident decision.</span></h2><p>Designed to help you understand the most important parts of a used vehicle's history.</p></div>
        <div className="vin-feature-cards">
          <article><div className="vin-feature-icon theft"><VehicleCheckIcon kind="theft" /></div><h3>Theft check</h3><p>See whether a vehicle has been reported stolen in available records.</p><span>01 / VEHICLE SECURITY</span></article>
          <article><div className="vin-feature-icon mileage"><VehicleCheckIcon kind="mileage" /></div><h3>Mileage check</h3><p>Spot suspicious mileage readings and possible odometer inconsistencies.</p><span>02 / ODOMETER HISTORY</span></article>
          <article><div className="vin-feature-icon damage"><VehicleCheckIcon kind="damage" /></div><h3>Accident &amp; damage check</h3><p>Explore accident records, damage areas and illustrative repair information.</p><span>03 / DAMAGE HISTORY</span></article>
        </div>
      </section>
      <section className="vin-payment-strip" aria-label="Available mobile money methods">
        <div className="vin-payment-strip-inner"><strong>PAYMENT OPTIONS</strong><div className="vin-payment-list"><div className="vin-payment-brand vin-payment-mtn"><strong>MTN MoMo</strong><small>Mobile Money</small></div><div className="vin-payment-brand vin-payment-telecel" aria-label="Telecel Cash"><strong className="vin-telecel-wordmark">telecel<span>.</span></strong><small>Telecel Cash</small></div><div className="vin-payment-brand"><img src="https://tuameka.com/images/at_money.png" alt="AT Money logo" loading="lazy" /><small>AT Money</small></div></div></div>
      </section>
      <section className="vin-pricing" id="subscriptions">
        <div className="vin-pricing-grid">
          <article className="vin-pricing-card"><span className="vin-plan-label">ONE-TIME REPORT</span><h3>Single Report</h3><p className="vin-plan-price">45 <small>GHC / report</small></p><p>Check <strong>1 vehicle</strong> with no monthly subscription.</p><div className="vin-plan-unit">One-time payment · No subscription required</div><button type="button" onClick={() => window.alert('Single-report payments are coming soon. Online payments and live vehicle data are not yet available.')}>Buy One Report →</button></article>
          <div className="vin-section-intro"><span className="vin-eyebrow">SIMPLE, FLEXIBLE PRICING</span><h2>Check more vehicles. <span>Save more.</span></h2><p>Pay for one report or choose a monthly plan. Prices in Ghanaian cedis (GHC).</p></div>
          <article className="vin-pricing-card"><span className="vin-plan-label">BASIC SUBSCRIPTION</span><h3>Basic</h3><p className="vin-plan-price">189 <small>GHC / month</small></p><p>Check up to <strong>10 vehicles</strong> every month.</p><div className="vin-plan-unit">18.90 GHC per vehicle when fully used</div><button type="button" onClick={() => window.alert('Subscriptions are coming soon. Online payments are not yet available.')}>Subscribe Now →</button></article>
          <article className="vin-pricing-card vin-pricing-featured"><span className="vin-plan-label">BEST VALUE</span><h3>Premium</h3><p className="vin-plan-price">289 <small>GHC / month</small></p><p>Check up to <strong>20 vehicles</strong> every month.</p><div className="vin-plan-unit">14.45 GHC per vehicle when fully used</div><button type="button" onClick={() => window.alert('Subscriptions are coming soon. Online payments are not yet available.')}>Subscribe Now →</button></article>
        </div><p className="vin-pricing-note">Coming soon · Online payments and live vehicle data are not yet connected.</p>
      </section>
      <section className="vin-sample-cta"><div><span className="vin-eyebrow">SEE HOW IT WORKS</span><h2>Try a real-feeling report.<br/><span>With fictional data.</span></h2><p>We've prepared a Toyota Hilux 4x4 example so you can explore the full experience.</p></div><button type="button" onClick={() => { setMethod('vin'); setQuery(SAMPLE_VIN); setReport(true); setSearchCompleted(true); setActive(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Open sample report <span>↗</span></button></section>
    </main> : <main className="vin-report-page">
      <div className="vin-report-shell">
        <div className="vin-report-topline"><button type="button" onClick={() => setReport(false)}>← New vehicle check</button><span>FICTIONAL SAMPLE REPORT · NOT A LIVE VIN LOOKUP</span></div>
        <div className="vin-report-heading"><div><span className="vin-eyebrow">YOUR VEHICLE HISTORY</span><h1>{example.model}</h1><p>{example.year} · 4x4 Pickup · {example.location}</p><div className="vin-report-id">VIN <strong>{example.vin}</strong> <button type="button" onClick={() => navigator.clipboard?.writeText(example.vin)}>Copy</button></div></div><div className="vin-report-heading-tag">SAMPLE REPORT <span>●</span></div></div>
        <div className="vin-report-disclaimer"><strong>Demo mode:</strong> This report contains fictional vehicle history, invented incidents and illustrative imagery. No theft, mileage or accident database has been queried.</div>
        <div className="vin-report-summary"><div><span>REPORT OVERVIEW</span><h2>Your vehicle, at a glance.</h2><p>Explore the three essential checks below. Select a card to view its findings.</p></div><div className="vin-summary-pill">3 CHECKS COMPLETED <span>✓</span><small>SIMULATED</small></div></div>
        <div className="vin-report-grid">
          <button type="button" className={'vin-check-card '+(active==='theft'?'is-active':'')} onClick={() => setActive(active==='theft'?null:'theft')} aria-expanded={active==='theft'}><div className="vin-check-icon green"><VehicleCheckIcon kind="theft" /></div><span className="vin-check-kicker">01 · THEFT CHECK</span><h3>No theft flag</h3><p>No stolen-vehicle record is included in this fictional example.</p><div className="vin-check-status good"><span>●</span> No sample alert</div><div className="vin-check-link">View details <span>↗</span></div></button>
          <button type="button" className={'vin-check-card '+(active==='mileage'?'is-active':'')} onClick={() => setActive(active==='mileage'?null:'mileage')} aria-expanded={active==='mileage'}><div className="vin-check-icon amber"><VehicleCheckIcon kind="mileage" /></div><span className="vin-check-kicker">02 · MILEAGE CHECK</span><h3>112,800 km</h3><p>Review example odometer readings and the mileage timeline.</p><div className="vin-check-status caution"><span>●</span> Sample history available</div><div className="vin-check-link">View details <span>↗</span></div></button>
          <button type="button" className={'vin-check-card '+(active==='damage'?'is-active':'')} onClick={() => setActive(active==='damage'?null:'damage')} aria-expanded={active==='damage'}><div className="vin-check-icon red"><VehicleCheckIcon kind="damage" /></div><span className="vin-check-kicker">03 · ACCIDENT & DAMAGE</span><h3>1 damage event</h3><p>A fictional front-end collision is included in this example report.</p><div className="vin-check-status alert"><span>●</span> Sample damage reported</div><div className="vin-check-link">View details <span>↗</span></div></button>
        </div>
        {active && <section className="vin-expanded" aria-live="polite">
          <div className="vin-expanded-heading"><div><span className="vin-eyebrow">DETAILED FINDINGS</span><h2 className="vin-detail-heading"><VehicleCheckIcon kind={active || "theft"} />{active==='theft'?'Theft check':active==='mileage'?'Mileage history':'Accident & damage history'}</h2></div><button type="button" onClick={() => setActive(null)}>Close ×</button></div>
          {active==='theft' && <div className="vin-theft-result"><div className="vin-big-check">✓</div><div><h3>No theft report in this sample</h3><p>The fictional example does not contain a stolen-vehicle entry. This is not confirmation that any real vehicle is free from theft records.</p><div className="vin-detail-row"><span>Record status</span><strong>No sample flag</strong></div><div className="vin-detail-row"><span>Coverage</span><strong>Demo only · no database connected</strong></div></div></div>}
          {active==='mileage' && <div className="vin-mileage-detail"><div className="vin-mileage-hero"><span>LATEST EXAMPLE READING</span><strong>112,800 <small>km</small></strong><p>Sample odometer history · no live records</p></div><div className="vin-mileage-list">{[['2019','12,500 km'],['2020','35,400 km'],['2021','61,700 km'],['2022','84,200 km'],['2024','112,800 km']].map(([year,km])=><div key={year}><span>{year}</span><div className="vin-mileage-bar"><i style={{width:(Number(km.replace(/\D/g,''))/112800*100)+'%'}}/></div><strong>{km}</strong></div>)}</div></div>}
          {active==='damage' && <div className="vin-damage-detail"><div className="vin-damage-info"><div className="vin-damage-tag">FICTIONAL INCIDENT · 2021</div><h3>Front-end collision</h3><p>Example damage involving the front bumper, bonnet, grille and lighting components. This event and all associated costs are invented for demonstration.</p><div className="vin-detail-row"><span>Impact area</span><strong>Front section</strong></div><div className="vin-detail-row"><span>Severity</span><strong>Moderate · example</strong></div><div className="vin-detail-row"><span>Estimated repairs</span><strong>$3,200–$5,100 · fictional</strong></div><div className="vin-detail-row"><span>Reported in</span><strong>Ghana · sample</strong></div><a href="/demo" className="vin-deeper-link">Explore extended damage demo ↗</a></div><div className="vin-damage-photo"><img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&q=85" alt="Illustrative accident scene unrelated to the Toyota Hilux example" /><div>ILLUSTRATIVE PHOTO · NOT THE ACTUAL VEHICLE OR INCIDENT</div></div></div>}
        </section>}
        <div className="vin-report-end"><span>ⓘ All results on this page are fictional. Live VIN and license plate lookups are not available.</span><button type="button" onClick={() => {setReport(false);setQuery('');setActive(null)}}>Check another vehicle →</button></div>
      </div>
    </main>}
    <footer className="vin-footer"><span>© 2026 CheckYourVINNumber.com</span><span>Independent vehicle history concept · Demo only</span></footer>
  </div>
}
