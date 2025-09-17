import React, { useState, useEffect, useRef } from 'react';
import { getTicketStats, refreshTicketStats } from '../services/api';

const SimpleDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const chartRef = useRef(null);

  // Load data function
  const loadData = async () => {
    try {
      setError(null);
      const response = await getTicketStats();
      
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error('Failed to load data');
      }
    } catch (err) {
      setError(err.message || 'Failed to load ticket statistics');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data function
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await refreshTicketStats();
      if (response.success) {
        setData(response.data);
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data && chartRef.current) {
      drawChart();
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      if (data && chartRef.current) {
        drawChart();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  const drawChart = () => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 32; // учитываем padding
    const containerHeight = 250;

    // Устанавливаем реальные размеры canvas
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    const ctx = canvas.getContext('2d');
    const padding = 40;
    const chartWidth = containerWidth - 2 * padding;
    const chartHeight = containerHeight - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, containerWidth, containerHeight);

    // Sort data by date and take last 10 entries for better display
    const sortedData = [...data.daily_stats]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10); // показываем последние 10 дней

    // Get max value for scaling
    const maxValue = Math.max(...sortedData.map(d => d.count));
    const scale = chartHeight / (maxValue + 2);

    // Draw bars
    const barWidth = Math.min(60, (chartWidth / sortedData.length) - 20); // ограничиваем максимальную ширину
    const totalBarsWidth = sortedData.length * (barWidth + 20);
    const startX = (containerWidth - totalBarsWidth) / 2; // центрируем бары
    
    sortedData.forEach((day, index) => {
      const x = startX + index * (barWidth + 20);
      const barHeight = day.count * scale;
      const y = containerHeight - padding - barHeight;

      // Draw bar with gradient effect
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1d4ed8');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(day.count, x + barWidth/2, y - 8);

      // Draw date label
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      const date = new Date(day.date);
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.fillText(dateLabel, x + barWidth/2, containerHeight - padding + 20);
    });

    // Draw y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= maxValue + 2; i += Math.ceil((maxValue + 2) / 5)) {
      const y = containerHeight - padding - (i * scale);
      ctx.fillText(i, padding - 10, y + 4);
    }

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= maxValue + 2; i += Math.ceil((maxValue + 2) / 5)) {
      const y = containerHeight - padding - (i * scale);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(containerWidth - padding, y);
      ctx.stroke();
    }
  };

  // Error state (when data loading fails)
  if (error && !data) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '500px',
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#fee2e2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            ⚠️
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Failed to Load Data
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}>
            {error}
          </p>
          <button
            onClick={loadData}
            disabled={loading}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            {loading ? 'Loading...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem',
                margin: 0
              }}>
                📊 Gist Tickets Dashboard
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: 0 }}>
                Support system statistics and analytics
              </p>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                opacity: refreshing ? 0.7 : 1,
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseOver={(e) => {
                if (!refreshing) e.target.style.backgroundColor = '#2563eb';
              }}
              onMouseOut={(e) => {
                if (!refreshing) e.target.style.backgroundColor = '#3b82f6';
              }}
            >
              <span style={{
                display: 'inline-block',
                transform: refreshing ? 'rotate(360deg)' : 'rotate(0deg)',
                transition: 'transform 1s linear',
                animation: refreshing ? 'spin 1s linear infinite' : 'none'
              }}>
                🔄
              </span>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {/* Error banner (if error occurred but data is still available) */}
          {error && data && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '0.5rem',
              color: '#92400e',
              fontSize: '0.9rem'
            }}>
              ⚠️ {error} (Showing cached data)
            </div>
          )}
        </div>

        {/* Total tickets count */}
        {data && (
          <div style={{
            backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            background: '#3b82f6',
            borderRadius: '1rem',
            padding: '2rem',
            color: 'white',
            marginBottom: '2rem',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                marginRight: '1rem'
              }}>
                🎫
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                Total Tickets
              </h2>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {data.total_count?.toLocaleString() || '0'}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Active requests in the system
            </div>
          </div>
        )}

        {/* Status Statistics */}
        {data && data.status_stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Active tickets */}
            {data.status_stats.active && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Resolved tickets✅
                  </h3>
                  <div style={{
                    backgroundColor: '#dcfce7',
                    borderRadius: '0.5rem',
                    padding: '0.5rem'
                  }}>
                    ✅
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
                  {data.status_stats.active.count?.toLocaleString() || '0'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {data.status_stats.active.percentage || 0}% of total count
                </div>
                <div style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '1rem',
                  height: '0.5rem'
                }}>
                  <div style={{
                    width: `${data.status_stats.active.percentage || 0}%`,
                    backgroundColor: '#059669',
                    height: '100%',
                    borderRadius: '1rem'
                  }}></div>
                </div>
              </div>
            )}

            {/* Escalated tickets */}
            {data.status_stats.escalated && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Escalated tickets
                  </h3>
                  <div style={{
                    backgroundColor: '#fee2e2',
                    borderRadius: '0.5rem',
                    padding: '0.5rem'
                  }}>
                    ⚠️
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
                  {data.status_stats.escalated.count?.toLocaleString() || '0'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {data.status_stats.escalated.percentage || 0}% of total count
                </div>
                <div style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '1rem',
                  height: '0.5rem'
                }}>
                  <div style={{
                    width: `${data.status_stats.escalated.percentage || 0}%`,
                    backgroundColor: '#dc2626',
                    height: '100%',
                    borderRadius: '1rem'
                  }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily Statistics Chart */}
        {data && data.daily_stats && data.daily_stats.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{
                backgroundColor: '#dbeafe',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                marginRight: '1rem'
              }}>
                📊
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Daily Statistics
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                  Ticket creation dynamics (showing last 10 days)
                </p>
              </div>
            </div>

            {/* Chart Container */}
            <div style={{ 
              position: 'relative',
              height: '300px',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              padding: '1rem'
            }}>
              <canvas
                ref={chartRef}
                style={{
                  width: '100%',
                  height: '250px',
                  display: 'block'
                }}
              />
            </div>

            {/* Chart Summary */}
            <div style={{
              marginTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#eff6ff',
                borderRadius: '0.5rem'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.25rem' }}>
                  {(() => {
                    const sortedData = [...data.daily_stats].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-10);
                    return (sortedData.reduce((sum, day) => sum + (day.count || 0), 0) / sortedData.length).toFixed(1);
                  })()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Average per day
                </div>
              </div>
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '0.5rem'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.25rem' }}>
                  {(() => {
                    const sortedData = [...data.daily_stats].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-10);
                    return Math.max(...sortedData.map(d => d.count || 0));
                  })()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Peak day (shown)
                </div>
              </div>
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.5rem'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.25rem' }}>
                  {data.daily_stats.reduce((sum, day) => sum + (day.count || 0), 0)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Total all time
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Status */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.9rem'
        }}>
          🟢 System is running stable • Last updated: {new Date().toLocaleTimeString('en-US')}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SimpleDashboard;
