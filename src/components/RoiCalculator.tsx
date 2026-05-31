import { useState } from 'preact/hooks';

export default function RoiCalculator() {
  const [activeTab, setActiveTab] = useState<'financial' | 'time'>('financial');

  // State for Financial Tab
  const [revenue, setRevenue] = useState<number>(100000); // Default $100k
  const [shrinkageRate, setShrinkageRate] = useState<number>(1.5); // Default 1.5%
  const [preventionRate] = useState<number>(65); // Default 65% reduction

  // State for Time & Lifestyle Tab
  const [income, setIncome] = useState<number>(100000); // Default $100k owner income
  const [workHours, setWorkHours] = useState<number>(40); // Default 40 hours/week
  const [timeSaved, setTimeSaved] = useState<number>(15); // Default 15 minutes/day

  // App cost model ($10/month = $120/year)
  const estimatedAppCostYearly = 120;

  // Financial Tab Calculations
  const annualShrinkage = Math.round(revenue * (shrinkageRate / 100));
  const recoveredShrinkage = Math.round(annualShrinkage * (preventionRate / 100));
  const netSavings = Math.max(0, recoveredShrinkage - estimatedAppCostYearly);
  const roiMultiple = estimatedAppCostYearly > 0 ? (recoveredShrinkage / estimatedAppCostYearly).toFixed(1) : '0';

  // Time Tab Calculations
  const weeksPerYear = 50;
  const hourlyRate = income / (weeksPerYear * workHours);
  const annualHoursSaved = (timeSaved * 365) / 60;
  const reclaimedWorkingDays = annualHoursSaved / 8; // Assumes 8 hour work days
  const timeValueSaved = Math.round(annualHoursSaved * hourlyRate);
  const timeNetSavings = Math.max(0, timeValueSaved - estimatedAppCostYearly);
  const timeRoiMultiple = estimatedAppCostYearly > 0 ? (timeValueSaved / estimatedAppCostYearly).toFixed(1) : '0';

  // Combined Totals
  const combinedSavings = netSavings + timeNetSavings;
  const combinedRoiMultiple = estimatedAppCostYearly > 0 ? ((recoveredShrinkage + timeValueSaved) / estimatedAppCostYearly).toFixed(1) : '0';

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div style={styles.cardContainer} className="glass-panel">
      {/* Big Picture Totals */}
      <div style={styles.bigPictureContainer}>
        <div style={styles.bigPictureCard}>
          <span style={styles.bigPictureLabel}>Total Combined Savings</span>
          <span style={styles.bigPictureValue}>{formatCurrency(combinedSavings)}<span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: '500' }}>/yr</span></span>
        </div>
        <div style={styles.bigPictureCard}>
          <span style={styles.bigPictureLabel}>Total Combined ROI</span>
          <span style={styles.bigPictureValueROI}>{combinedRoiMultiple}x</span>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Tabs Header */}
      <div className="tab-container" style={styles.tabContainer}>
        {activeTab === 'financial' ? (
          <>
            <h2 className="active-title" style={styles.activeTitle}>
              Direct Financial ROI
            </h2>
            <button 
              className="inactive-tab-link" 
              style={styles.inactiveTabLink}
              onClick={() => setActiveTab('time')}
            >
              Time & Lifestyle ROI →
            </button>
          </>
        ) : (
          <>
            <h2 className="active-title" style={styles.activeTitle}>
              Time & Lifestyle ROI
            </h2>
            <button 
              className="inactive-tab-link" 
              style={styles.inactiveTabLink}
              onClick={() => setActiveTab('financial')}
            >
              ← Direct Financial ROI
            </button>
          </>
        )}
      </div>

      {activeTab === 'financial' ? (
        <div style={styles.grid}>
          {/* Input Controls - Financial */}
          <div style={styles.inputsSection}>
            <h3 style={styles.sectionTitle}>Calculate Cash Leak Recovery</h3>
            <p style={styles.subtitle}>Adjust the sliders to estimate how much revenue is escaping through shrinkage.</p>
            
            {/* Revenue Input */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <span style={styles.label}>Annual Store Revenue</span>
                <span style={styles.valueHighlight}>{formatCurrency(revenue)}</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="2000000" 
                step="10000"
                value={revenue} 
                onInput={(e) => setRevenue(parseInt((e.target as HTMLInputElement).value))}
                style={styles.slider}
              />
              <div style={styles.rangeLabels}>
                <span>$10K</span>
                <span>$1M</span>
                <span>$2M+</span>
              </div>
            </div>

            {/* Shrinkage Rate Input */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <span style={styles.label}>Estimated Shrinkage Rate</span>
                <span style={styles.valueHighlightLoss}>{shrinkageRate.toFixed(1)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="5.0" 
                step="0.1"
                value={shrinkageRate} 
                onInput={(e) => setShrinkageRate(parseFloat((e.target as HTMLInputElement).value))}
                style={styles.slider}
              />
              <div style={styles.rangeLabels}>
                <span>0.5% (Best Class)</span>
                <span>1.5% (Retail Avg)</span>
                <span>5.0% (High Risk)</span>
              </div>
            </div>

            <div style={styles.noteBox}>
              <p style={styles.noteText}>
                <strong>Note:</strong> National retail averages show shrinkage accounts for <strong>1.4% to 1.6%</strong> of total sales, driven by theft, administrative errors, and unaccounted variances.
              </p>
            </div>
          </div>

          {/* Results Section - Financial */}
          <div style={styles.resultsSection}>
            <div style={styles.resultCardLoss}>
              <span style={styles.resultLabel}>Estimated Annual Shrinkage Loss</span>
              <span style={styles.resultValueLoss}>{formatCurrency(annualShrinkage)}</span>
            </div>

            <div style={styles.resultCardSecure}>
              <span style={styles.resultLabel}>Recovered with Chain of Custody</span>
              <span style={styles.resultValueSecure}>{formatCurrency(recoveredShrinkage)}</span>
              <span style={styles.savingsSubtext}>Based on an average 65% reduction in discrepancy rates</span>
            </div>

            {/* Net Benefit Callouts */}
            <div style={styles.netSavingsGrid}>
              <div style={styles.netCard}>
                <span style={styles.netLabel}>App Subscription Cost</span>
                <span style={styles.netValueCost}>{formatCurrency(estimatedAppCostYearly)}/yr</span>
                <span style={styles.costSubtext}>Just $10/month</span>
              </div>
              <div style={styles.netCard}>
                <span style={styles.netLabel}>Net Annual Savings</span>
                <span style={styles.netValue}>{formatCurrency(netSavings)}</span>
                <span style={styles.savingsSubtext}>After app cost</span>
              </div>
              <div style={styles.netCard}>
                <span style={styles.netLabel}>Estimated ROI</span>
                <span style={styles.netValueROI}>{roiMultiple}x</span>
                <span style={styles.savingsSubtext}>Return on investment</span>
              </div>
            </div>

            <div style={styles.ctaWrapper}>
              <a href="https://apps.shopify.com" target="_blank" style={styles.ctaButton} className="btn btn-secure">
                Save {formatCurrency(netSavings)}/yr — Start Protecting Your Store
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.grid}>
          {/* Input Controls - Time & Lifestyle */}
          <div style={styles.inputsSection}>
            <h3 style={styles.sectionTitle}>Calculate Your Time Reclaimed</h3>
            <p style={styles.subtitle}>Adjust the sliders to see how much personal time and salary value you buy back.</p>
            
            {/* Income Input */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <span style={styles.label}>Your Target Annual Salary / Income</span>
                <span style={styles.valueHighlight}>{formatCurrency(income)}</span>
              </div>
              <input 
                type="range" 
                min="50000" 
                max="5000000" 
                step="10000"
                value={income} 
                onInput={(e) => setIncome(parseInt((e.target as HTMLInputElement).value))}
                style={styles.slider}
              />
              <div style={styles.rangeLabels}>
                <span>$50K</span>
                <span>$250K</span>
                <span>$500K+</span>
              </div>
            </div>

            {/* Hours Worked Input */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <span style={styles.label}>Weekly Hours Spent on Business</span>
                <span style={styles.valueHighlightTime}>{workHours} hours</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="60" 
                step="5"
                value={workHours} 
                onInput={(e) => setWorkHours(parseInt((e.target as HTMLInputElement).value))}
                style={styles.slider}
              />
              <div style={styles.rangeLabels}>
                <span>30 hours</span>
                <span>45 hours</span>
                <span>60 hours</span>
              </div>
            </div>

            {/* Daily Time Saved Input */}
            <div style={styles.inputGroup}>
              <div style={styles.labelRow}>
                <span style={styles.label}>Daily Time Saved with ONIT Security App</span>
                <span style={styles.valueHighlightTime}>{timeSaved} minutes</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="1"
                value={timeSaved} 
                onInput={(e) => setTimeSaved(parseInt((e.target as HTMLInputElement).value))}
                style={styles.slider}
              />
              <div style={styles.rangeLabels}>
                <span>5 mins (Quick review)</span>
                <span>15 mins (Average saved)</span>
                <span>30 mins (Heavy logging)</span>
              </div>
            </div>

            <div style={styles.noteBox}>
              <p style={styles.noteText}>
                <strong>Note:</strong> Wasting {timeSaved} minutes a day cross-referencing logs equals <strong>{Math.round(annualHoursSaved)} hours</strong> of wasted thinking time per year.
                <span style={{ fontSize: '1.1rem', display: 'block', marginTop: '8px', fontWeight: '700', color: '#ffffff' }}>
                  Reclaim that time to grow your business and <span style={{ fontWeight: '850', color: '#a855f7' }}>Enjoy your Life!</span>
                </span>
              </p>
            </div>
          </div>

          {/* Results Section - Time & Lifestyle */}
          <div style={styles.resultsSection}>
            <div style={styles.resultCardTime}>
              <span style={styles.resultLabel}>Annual Personal Time Reclaimed</span>
              <span style={styles.resultValueTime}>{annualHoursSaved.toFixed(1)} Hours</span>
              <span style={styles.savingsSubtextTime}>Equivalent to buying back **{reclaimedWorkingDays.toFixed(1)} full 8-hour working days**</span>
            </div>

            <div style={styles.resultCardSecure}>
              <span style={styles.resultLabel}>Value of Reclaimed Time</span>
              <span style={styles.resultValueSecure}>{formatCurrency(timeValueSaved)}/yr</span>
              <span style={styles.savingsSubtext}>Based on your calculated time value of **{formatCurrency(Math.round(hourlyRate))}/hour**</span>
            </div>

            {/* Net Benefit Callouts */}
            <div style={styles.netSavingsGrid}>
              <div style={styles.netCard}>
                <span style={styles.netLabel}>App Subscription Cost</span>
                <span style={styles.netValueCost}>{formatCurrency(estimatedAppCostYearly)}/yr</span>
                <span style={styles.costSubtext}>Just $10/month</span>
              </div>
              <div style={styles.netCard}>
                <span style={styles.netLabel}>Net Lifestyle Gain</span>
                <span style={styles.netValue}>{formatCurrency(timeNetSavings)}</span>
                <span style={styles.savingsSubtext}>Value after app cost</span>
              </div>
              <div style={styles.netCard}>
                <span style={styles.netLabel}>Lifestyle ROI</span>
                <span style={styles.netValueROI}>{timeRoiMultiple}x</span>
                <span style={styles.savingsSubtext}>Return on time spend</span>
              </div>
            </div>

            <div style={styles.ctaWrapper}>
              <a href="https://apps.shopify.com" target="_blank" style={styles.ctaButton} className="btn btn-secure">
                Reclaim {Math.round(annualHoursSaved)} Hours/yr — Start Saving Time
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  cardContainer: {
    padding: '36px',
    maxWidth: '1000px',
    margin: '0 auto',
    borderRadius: '20px',
  },
  bigPictureContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
  },
  bigPictureCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    flex: '1',
    minWidth: '200px',
  },
  bigPictureLabel: {
    fontSize: '0.95rem',
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  bigPictureValue: {
    fontSize: '2.8rem',
    fontWeight: '800' as const,
    color: '#10b981',
    fontFamily: 'Outfit, sans-serif',
  },
  bigPictureValueROI: {
    fontSize: '2.8rem',
    fontWeight: '800' as const,
    color: '#6366f1',
    fontFamily: 'Outfit, sans-serif',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    margin: '0 0 24px 0',
  },
  tabContainer: {
    position: 'relative' as const,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '60px',
    marginBottom: '30px',
  },
  activeTitle: {
    fontSize: '2rem',
    fontWeight: '850' as const,
    fontFamily: 'Outfit, sans-serif',
    color: '#ffffff',
    textAlign: 'center' as const,
    margin: 0,
    background: 'none',
    border: 'none',
    outline: 'none',
  },
  inactiveTabLink: {
    position: 'absolute' as const,
    right: 0,
    padding: '8px 16px',
    borderRadius: '20px',
    backgroundColor: '#e5e7eb',
    color: '#111827',
    fontWeight: '700' as const,
    fontSize: '0.8rem',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '36px',
    alignItems: 'start',
  },
  inputsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  sectionTitle: {
    fontSize: '1.6rem',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '0.95rem',
    lineHeight: '1.4',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBlock: '10px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#d1d5db',
    fontSize: '1rem',
    fontWeight: '500' as const,
  },
  valueHighlight: {
    color: '#6366f1',
    fontWeight: '700' as const,
    fontSize: '1.25rem',
    fontFamily: 'Outfit, sans-serif',
  },
  valueHighlightLoss: {
    color: '#ef4444',
    fontWeight: '700' as const,
    fontSize: '1.25rem',
    fontFamily: 'Outfit, sans-serif',
  },
  valueHighlightTime: {
    color: '#a855f7',
    fontWeight: '700' as const,
    fontSize: '1.25rem',
    fontFamily: 'Outfit, sans-serif',
  },
  slider: {
    width: '100%',
    height: '6px',
    backgroundColor: '#374151',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer',
    accentColor: '#6366f1',
  },
  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#6b7280',
  },
  noteBox: {
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    borderLeft: '3px solid #6366f1',
  },
  noteText: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    lineHeight: '1.5',
  },
  resultsSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    padding: '24px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  resultCardLoss: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '16px',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '10px',
  },
  resultCardTime: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '16px',
    backgroundColor: 'rgba(168, 85, 247, 0.05)',
    border: '1px solid rgba(168, 85, 247, 0.15)',
    borderRadius: '10px',
  },
  resultLabel: {
    fontSize: '0.85rem',
    color: '#9ca3af',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  resultValueLoss: {
    fontSize: '2rem',
    fontWeight: '700' as const,
    color: '#ef4444',
    fontFamily: 'Outfit, sans-serif',
  },
  resultValueTime: {
    fontSize: '2rem',
    fontWeight: '700' as const,
    color: '#a855f7',
    fontFamily: 'Outfit, sans-serif',
  },
  savingsSubtextTime: {
    fontSize: '0.75rem',
    color: '#a855f7',
    marginTop: '4px',
  },
  resultCardSecure: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '20px',
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '10px',
  },
  resultValueSecure: {
    fontSize: '2.2rem',
    fontWeight: '700' as const,
    color: '#10b981',
    fontFamily: 'Outfit, sans-serif',
    marginTop: '4px',
  },
  savingsSubtext: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  netSavingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: '12px',
  },
  netCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
  },
  netLabel: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  netValue: {
    fontSize: '1.25rem',
    fontWeight: '600' as const,
    color: '#ffffff',
    fontFamily: 'Outfit, sans-serif',
  },
  netValueCost: {
    fontSize: '1.25rem',
    fontWeight: '600' as const,
    color: '#9ca3af',
    fontFamily: 'Outfit, sans-serif',
  },
  costSubtext: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '2px',
  },
  netValueROI: {
    fontSize: '1.25rem',
    fontWeight: '700' as const,
    color: '#6366f1',
    fontFamily: 'Outfit, sans-serif',
  },
  ctaWrapper: {
    marginTop: '10px',
  },
  ctaButton: {
    display: 'block',
    width: '100%',
    textAlign: 'center' as const,
    padding: '16px',
    fontSize: '1.05rem',
  },
};
