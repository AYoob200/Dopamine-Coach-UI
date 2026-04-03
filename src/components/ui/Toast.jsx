import { AnimatePresence, motion } from 'framer-motion';
import { useGlobalState } from '../../context/GlobalStateContext';
import { CheckCircle2, Info, PartyPopper } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  info: Info,
  celebration: PartyPopper,
};

const styles = {
  success: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900',
  info: 'bg-gray-700 dark:bg-gray-600 text-white',
  celebration: 'bg-green-600 text-white',
};

export default function Toast() {
  const { toast } = useGlobalState();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className={`flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg ${styles[toast.type] || styles.info}`}>
            {(() => {
              const Icon = icons[toast.type] || Info;
              return <Icon size={16} />;
            })()}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
