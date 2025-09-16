import React, { useState, useEffect, useRef } from 'react';

const SimpleDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  // Mock data
  const mockData = {
    total_count: 150,
    status_stats: {
      resolved: {
        count: 120,
        percentage: 80.0
      },
      escalated: {
        count: 30,
        percentage: 20.0
      }
    },
    daily_stats: [
      { date: "2025-09-10", count: 5 },
      { date: "2025-09-11", count: 8 },
      { date: "2025-09-12", count: 12 },
      { date: "2025-09-13", count: 7 },
      { date: "2025-09-14", count: 15 },
      { date: "2025-09-15", count: 9 },
      { date: "2025-09-16", count: 11 }
    ]
  };

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (data && chartRef.current) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get max value for scaling
    const maxValue = Math.max(...data.daily_stats.map(d => d.count));
    const scale = chartHeight / (maxValue + 2);

    // Draw bars
    const barWidth = chartWidth / data.daily_stats.length - 10;
    
    data.daily_stats.forEach((day, index) => {
      const x = padding + index * (chartWidth / data.daily_stats.length) + 5;
      const barHeight = day.count * scale;
      const y = height - padding - barHeight;

      // Draw bar with gradient effect
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1d4ed8');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top of bar
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(day.count, x + barWidth/2, y - 5);

      // Draw date label
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      const date = new Date(day.date);
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.fillText(dateLabel, x + barWidth/2, height - padding + 20);
    });

    // Draw y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= maxValue + 2; i += Math.ceil((maxValue + 2) / 5)) {
      const y = height - padding - (i * scale);
      ctx.fillText(i, padding - 10, y + 3);
    }
  };

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
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            📊 Gist Tickets Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            Support system statistics and analytics
          </p>
        </div>

        {/* Total tickets count */}
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
            {data.total_count.toLocaleString()}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Active requests in the system
          </div>
        </div>

        {/* Status Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Resolved conversations */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                Resolved conversations
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
              {data.status_stats.resolved.count.toLocaleString()}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {data.status_stats.resolved.percentage}% of total count
            </div>
            <div style={{
              width: '100%',
              backgroundColor: '#e5e7eb',
              borderRadius: '1rem',
              height: '0.5rem'
            }}>
              <div style={{
                width: `${data.status_stats.resolved.percentage}%`,
                backgroundColor: '#059669',
                height: '100%',
                borderRadius: '1rem'
              }}></div>
            </div>
          </div>

          {/* Escalated tickets */}
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
              {data.status_stats.escalated.count.toLocaleString()}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {data.status_stats.escalated.percentage}% of total count
            </div>
            <div style={{
              width: '100%',
              backgroundColor: '#e5e7eb',
              borderRadius: '1rem',
              height: '0.5rem'
            }}>
              <div style={{
                width: `${data.status_stats.escalated.percentage}%`,
                backgroundColor: '#dc2626',
                height: '100%',
                borderRadius: '1rem'
              }}></div>
            </div>
          </div>
        </div>

        {/* Daily Statistics Chart */}
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
                Ticket creation dynamics over the last 7 days
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
              width={800}
              height={250}
              style={{
                width: '100%',
                height: '100%',
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
                {(data.daily_stats.reduce((sum, day) => sum + day.count, 0) / data.daily_stats.length).toFixed(1)}
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
                {Math.max(...data.daily_stats.map(d => d.count))}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Peak day
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.25rem' }}>
                {data.daily_stats.reduce((sum, day) => sum + day.count, 0)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Total period
              </div>
            </div>
          </div>
        </div>

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
