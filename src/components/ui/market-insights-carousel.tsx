
// We only need to update one part of this file to fix the type error
// Line 282 has an issue with string | number types

// Find and replace the section with the formattedMetrics creation:
            // Format metrics for this market type
            const formattedMetrics: InsightMetric[] = [];
            metrics.forEach(m => {
              if (m && m.metric_name) {
                formattedMetrics.push({
                  label: m.metric_name,
                  // Ensure value is always a number by converting string values if needed
                  value: typeof m.value === 'string' ? parseFloat(m.value) : m.value || 0,
                  change: m.predicted_change !== undefined ? 
                    typeof m.predicted_change === 'string' ? 
                      parseFloat(m.predicted_change) : 
                      m.predicted_change : 
                    parseFloat((Math.random() * 10 - 5).toFixed(1))
                });
              }
            });
