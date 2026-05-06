import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { levels } from '@/data/levels';
import { useProgressStore } from '@/store/progressStore';

export function Completion() {
  const totalStars = useProgressStore((state) => state.totalStars);
  const completedLevels = useProgressStore((state) => state.completedLevels);
  const maxStars = levels.length * 3;
  const allCompleted = completedLevels.length === levels.length;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e0f4fb_0%,#ffffff_55%,#f5fbff_100%)] px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-md rounded-[32px] bg-white p-7 shadow-[0_18px_50px_rgba(0,153,204,0.12)] ring-1 ring-white">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          인하런 완주 요약
        </span>
        <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-slate-950">
          축하합니다!
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          {allCompleted
            ? '인덕이와 함께 6개 스테이지를 모두 완주했어요.'
            : '아직 진행 중이지만, 지금까지의 별과 완주 현황을 확인할 수 있어요.'}
        </p>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#0099CC_0%,#33B5E5_100%)] px-5 py-6 text-white">
          <p className="text-sm font-semibold text-white/80">총 별</p>
          <p className="mt-2 text-4xl font-black">
            {totalStars}/{maxStars}
          </p>
          <p className="mt-2 text-sm font-semibold text-white/85">
            완료 스테이지 {completedLevels.length}/{levels.length}
          </p>
        </div>

        <div className="mt-6 space-y-3 rounded-[24px] bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-500">다음 행동</p>
          <Link to="/levels" className="block">
            <Button className="w-full">
              {allCompleted ? '다시 레벨 보기' : '이어서 플레이하기'}
            </Button>
          </Link>
          <Link to="/" className="block">
            <Button variant="secondary" className="w-full">
              홈으로
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
