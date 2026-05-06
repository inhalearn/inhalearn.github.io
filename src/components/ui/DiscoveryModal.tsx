import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface DiscoveryModalProps {
  isOpen: boolean;
  onHint: () => void;
  onContinue: () => void;
  onClose: () => void;
}

export function DiscoveryModal({
  isOpen,
  onHint,
  onContinue,
  onClose,
}: DiscoveryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="text-5xl">💡</div>
        <h2 className="mt-4 text-2xl font-black text-orange-500">발견!</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          같은 블록을 계속 쓰고 있네요...
          <br />
          더 쉬운 방법이 있을까요?
        </p>
        <div className="mt-6 grid gap-3">
          <Button className="w-full" onClick={onHint}>
            💡 힌트 보기
          </Button>
          <Button variant="secondary" className="w-full" onClick={onContinue}>
            ➡️ 계속하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
