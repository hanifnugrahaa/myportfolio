import { CalendarDays, FileText, FolderKanban, LayoutDashboard, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const items = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', Icon: FolderKanban },
  { id: 'activities', label: 'Activities', Icon: CalendarDays },
  { id: 'cv', label: 'CV', Icon: FileText },
] as const;

export type AdminTab = typeof items[number]['id'];

export default function AdminSidebar({ activeTab, onTabChange, collapsed, onToggle }: {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const toggleLabel = collapsed ? 'Perluas sidebar' : 'Perkecil sidebar';
  const reduceMotion = useReducedMotion();
  const transition = { duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' as const };
  const labelStart = reduceMotion ? false : { opacity: 0, x: -5 };

  return (
    <aside className={`relative z-20 flex w-full shrink-0 flex-col gap-3 border-b border-neutral-800 bg-neutral-900 p-3 md:border-b-0 md:bg-transparent ${collapsed ? 'md:w-18' : 'md:w-64'}`}>
      <div aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 hidden w-64 border-r border-neutral-800 bg-neutral-900 shadow-2xl after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-transparent after:via-sky-300/30 after:to-transparent motion-safe:transition-transform motion-safe:duration-[340ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] md:block ${collapsed ? '-translate-x-46' : 'translate-x-0'}`} />
      <div className="relative flex h-10 min-w-0 items-center gap-3">
        <button type="button" aria-label={toggleLabel} title={toggleLabel} aria-expanded={!collapsed}
          aria-controls="admin-navigation" onClick={onToggle}
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-neutral-700 text-neutral-300 transition-colors hover:border-sky-400/50 hover:bg-neutral-800 hover:text-sky-200">
          <motion.span key={toggleLabel} aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0.35 }}
            animate={{ opacity: 1 }} transition={transition}>
            <ToggleIcon size={19} />
          </motion.span>
        </button>
        {!collapsed && <motion.p initial={labelStart} animate={{ opacity: 1, x: 0 }} transition={transition}
          className="whitespace-nowrap text-base font-semibold tracking-tight">Admin Panel</motion.p>}
      </div>
      <nav id="admin-navigation" aria-label="Menu admin" className="relative flex h-11 min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] md:h-auto md:w-full md:flex-col md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {items.map(({ id, label, Icon }, index) => (
          <button key={id} type="button" aria-label={label} title={collapsed ? label : undefined}
            aria-current={activeTab === id ? 'true' : undefined} onClick={() => onTabChange(id)}
            className={`flex h-11 shrink-0 items-center gap-2 rounded-lg text-sm font-medium transition-colors ${collapsed ? 'w-11 justify-center md:w-full md:justify-start md:px-3' : 'px-3'} ${activeTab === id ? 'bg-white text-neutral-950' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}`}>
            <Icon size={19} aria-hidden="true" className="shrink-0" />
            {!collapsed && <motion.span initial={labelStart} animate={{ opacity: 1, x: 0 }}
              transition={{ ...transition, delay: reduceMotion ? 0 : index * 0.025 }}
              className="whitespace-nowrap">{label}</motion.span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
