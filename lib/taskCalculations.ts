import type { Task, TeamMember } from './types';

export const computeSkillMultiplier = (skillLevel: number) => Math.max(0.8, 1.4 - skillLevel * 0.12);

export const calculateTaskEffectiveLoad = (task: Task, members: TeamMember[]) => {
  if (task.assignedMembers.length === 0) return 0;
  const shares = task.assignedMembers.length;
  return task.assignedMembers.reduce((sum, memberId) => {
    const member = members.find((item) => item.id === memberId);
    if (!member) return sum;
    const base = task.requiredManMonths / shares;
    return sum + base * computeSkillMultiplier(member.skillLevel);
  }, 0);
};

export const calculateMemberUtilization = (member: TeamMember, tasks: Task[]) => {
  const assignedTasks = tasks.filter((task) => task.assignedMembers.includes(member.id));
  const rawManMonths = assignedTasks.reduce((sum, task) => {
    const share = Math.max(task.assignedMembers.length, 1);
    const base = task.requiredManMonths / share;
    return sum + base * computeSkillMultiplier(member.skillLevel);
  }, 0);
  return Math.min(150, Math.round(rawManMonths * 100));
};
