import type { Task } from '../scenarios/opticsTasks';

export function TaskNavigator({ tasks, activeId, onSelect }: { tasks: Task[]; activeId: number; onSelect: (id: number) => void }) {
  return <nav className="task-nav" aria-label="광학 공방 과제"><button type="button" disabled={activeId === tasks[0].id} onClick={() => onSelect(activeId - 1)}>이전</button>{tasks.map((task) => <button key={task.id} type="button" onClick={() => onSelect(task.id)} className={activeId === task.id ? 'active' : ''} aria-current={activeId === task.id ? 'step' : undefined}>과제 {task.id}<span>{task.title}</span></button>)}<button type="button" disabled={activeId === tasks[tasks.length - 1].id} onClick={() => onSelect(activeId + 1)}>다음</button></nav>;
}
