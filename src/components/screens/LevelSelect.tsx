import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { levels } from '@/data/levels';
import { useProgressStore } from '@/store/progressStore';

function getStarsLabel(stars: number): string {
  return `${'⭐'.repeat(stars)}${'·'.repeat(Math.max(0, 3 - stars))}`;
}

export function LevelSelect() {
  const completedLevels = useProgressStore((state) => state.completedLevels);
  const levelProgress = useProgressStore((state) => state.levelProgress);
  const totalStars = useProgressStore((state) => state.totalStars);
  const completedCount = completedLevels.length;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8">
      <div className="mx-auto max-w-md rounded-[28px] bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-700"
          >
            홈으로
          </Link>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#007299]">
            {levels.length}개 스테이지
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-slate-950">
          레벨 선택
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          총 {levels.length}개 스테이지를 따라 인덕이와 코딩 여행을 이어가세요.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] bg-sky-50 px-4 py-4">
            <p className="text-xs font-semibold text-[#007299]">완료</p>
            <p className="mt-1 text-2xl font-black text-slate-950">
              {completedCount}/{levels.length}
            </p>
          </div>
          <div className="rounded-[22px] bg-amber-50 px-4 py-4">
            <p className="text-xs font-semibold text-amber-700">총 별</p>
            <p className="mt-1 text-2xl font-black text-slate-950">
              {totalStars}/{levels.length * 3}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {levels.map((level, index) => {
            const isUnlocked =
              index === 0 || completedLevels.includes(levels[index - 1].id);
            const progress = levelProgress[level.id];
            const content = (
              <div
                className={[
                  'rounded-[24px] border px-5 py-4 transition-colors',
                  isUnlocked
                    ? 'border-slate-200 bg-slate-50 hover:border-sky-200 hover:bg-sky-50'
                    : 'border-slate-100 bg-slate-100 text-slate-400',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      스테이지 {level.id}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-950">
                      {level.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {progress ? getStarsLabel(progress.stars) : isUnlocked ? '도전 가능' : '잠금'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{level.mission}</p>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  {progress
                    ? `획득 별 ${progress.stars}/3 · 시도 ${progress.attempts}회`
                    : isUnlocked
                      ? '아직 완료하지 않았어요.'
                      : '이전 스테이지를 완료하면 열립니다.'}
                </p>
              </div>
            );

            if (!isUnlocked) {
              return (
                <div key={level.id} data-testid={`level-card-${level.id}`}>
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={level.id}
                to={`/level/${level.id}`}
                className="block"
                data-testid={`level-card-${level.id}`}
              >
                {content}
              </Link>
            );
          })}
        </div>

        {completedCount === levels.length ? (
          <Link to="/completion" className="mt-6 block">
            <Button className="w-full">완주 화면 보기</Button>
          </Link>
        ) : null}
      </div>
    </main>
  );
}
