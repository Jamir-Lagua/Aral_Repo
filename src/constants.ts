/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskCategory } from './types';

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  [TaskCategory.STUDY]: 'bg-blue-100 text-blue-700',
  [TaskCategory.ASSIGNMENT]: 'bg-purple-100 text-purple-700',
  [TaskCategory.PROJECT]: 'bg-amber-100 text-amber-700',
  [TaskCategory.EXAM]: 'bg-red-100 text-red-700',
  [TaskCategory.OTHER]: 'bg-slate-100 text-slate-700',
};

export const APP_NAME = "A.R.A.L.";
export const APP_FULL_NAME = "Adaptive Review and AI-Driven Learning System";
