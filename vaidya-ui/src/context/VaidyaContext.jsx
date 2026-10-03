import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { LEDGER_ROWS, PATIENTS, RESERVE, AGENTS, DEMO_SCRIPT, ITEMS } from '../data/mockData';
import { fetchState, fetchLedger, subscribeToEvents, isLive } from '../api/client';

const VaidyaContext = createContext(null);

export function VaidyaProvider({ children }) {
  const [ledger, setLedger] = useState(LEDGER_ROWS.slice(0, 6));
  const [patients, setPatients] = useState(PATIENTS);
  const [reserve, setReserve] = useState(RESERVE);
  const [items, setItems] = useState(ITEMS);
  const [demoMode, setDemoMode] = useState(false);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [activeAgent, setActiveAgent] = useState(null);
  const [activeScenario, setActiveScenario] = useState('Refill');
  const [pipelineStep, setPipelineStep] = useState(0);
  const [shipStage, setShipStage] = useState(0);
  const [redFlag, setRedFlag] = useState(false);
  const [demoSpeed, setDemoSpeed] = useState(1);
  const [drawerAgent, setDrawerAgent] = useState(null);
  const timerRef = useRef(null);
  const stepRef = useRef(0);

  // Load state from API if live
  useEffect(() => {
    if (isLive) {
      fetchState().then(s => {
        if (s.patients) setPatients(s.patients);
        if (s.reserve) setReserve(s.reserve);
        if (s.items) setItems(s.items);
      }).catch(console.error);
      fetchLedger().then(setLedger).catch(console.error);
      const unsub = subscribeToEvents(
        row => setLedger(prev => [row, ...prev]),
        console.error
      );
      return unsub;
    }
  }, []);

  // Demo playback
  const playDemoStep = useCallback((stepIdx) => {
    if (stepIdx >= DEMO_SCRIPT.length) {
      setDemoPlaying(false);
      setActiveAgent(null);
      return;
    }
    const step = DEMO_SCRIPT[stepIdx];
    const delay = step.delay / demoSpeed;

    timerRef.current = setTimeout(() => {
      setActiveAgent(step.agentKey);
      setActiveScenario(step.scenario || 'Refill');
      if (step.step !== undefined) setPipelineStep(step.step);
      if (step.shipStage !== undefined) setShipStage(step.shipStage);
      if (step.redFlag !== undefined) setRedFlag(step.redFlag);
      setLedger(prev => [step.row, ...prev]);
      setDemoStep(stepIdx + 1);
      stepRef.current = stepIdx + 1;

      // Animate active agent: clear after 700ms
      setTimeout(() => {
        if (stepRef.current === stepIdx + 1) setActiveAgent(null);
      }, 700);

      playDemoStep(stepIdx + 1);
    }, delay);
  }, [demoSpeed]);

  const playDemo = useCallback(() => {
    clearTimeout(timerRef.current);
    setDemoPlaying(true);
    setDemoStep(0);
    stepRef.current = 0;
    setLedger([]);
    playDemoStep(0);
  }, [playDemoStep]);

  const stopDemo = useCallback(() => {
    clearTimeout(timerRef.current);
    setDemoPlaying(false);
    setActiveAgent(null);
    setRedFlag(false);
  }, []);

  const toggleDemo = useCallback(() => {
    setDemoMode(prev => {
      if (prev) stopDemo();
      return !prev;
    });
  }, [stopDemo]);

  // KPI data
  const kpi = {
    closed: ledger.filter(r => r.msg.includes('closed')).length,
    held: reserve.hold,
    redFlags: ledger.filter(r => r.kind === 'stop').length,
    medianTime: '41s',
  };

  const value = {
    ledger, patients, reserve, items,
    demoMode, setDemoMode: toggleDemo,
    demoPlaying, playDemo, stopDemo,
    demoStep, demoSpeed, setDemoSpeed,
    activeAgent, activeScenario,
    pipelineStep, shipStage, redFlag,
    drawerAgent, setDrawerAgent,
    kpi,
    isLive,
  };

  return <VaidyaContext.Provider value={value}>{children}</VaidyaContext.Provider>;
}

export const useVaidya = () => useContext(VaidyaContext);
