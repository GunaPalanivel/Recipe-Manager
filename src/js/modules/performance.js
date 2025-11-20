/**
 * Performance Monitor - Performance tracking and logging
 *
 * @module performance
 * @description Monitors and logs performance metrics
 *
 * Tracks:
 * - localStorage operation times
 * - Render times
 * - Search/filter performance
 * - Core Web Vitals
 */

"use strict";

/**
 * Performance Monitor for localStorage ops
 * @module performance
 */

export class PerformanceMonitor {
  static mark(name) {
    if (performance && typeof performance.mark === "function") {
      performance.mark(name);
    }
  }

  static measure(name, startMark, endMark) {
    if (performance && typeof performance.measure === "function") {
      performance.measure(name, startMark, endMark);
      const entries = performance.getEntriesByName(name);
      entries.forEach((entry) => {
        console.info(
          `[Performance] ${entry.name}: ${entry.duration.toFixed(2)}ms`
        );
      });
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(name);
    }
  }
}
