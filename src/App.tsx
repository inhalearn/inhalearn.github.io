import { useState } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e0f4fb_0%,#ffffff_55%,#f5fbff_100%)] px-5 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-between">
        <section className="rounded-[32px] bg-white/90 p-7 shadow-[0_18px_50px_rgba(0,153,204,0.12)] ring-1 ring-white">
          <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-[#007299]">
            InhaLearn MVP
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-slate-950">
            인덕이와
            <br />
            블록 코딩 첫 수업
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            10분 안에 반복문의 필요를 몸으로 발견하는 모바일 우선 코딩
            플레이그라운드입니다.
          </p>
          <div className="mt-8 grid gap-3">
            <Link to="/levels" className="block">
              <Button className="w-full">시작하기</Button>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/demo" className="block">
                <Button variant="secondary" className="w-full">
                  20초 데모
                </Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(true)}
                className="w-full"
              >
                안내 보기
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-3 gap-3 text-center text-sm text-slate-600">
          <div className="rounded-3xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100">
            <div className="text-2xl">📍</div>
            <div className="mt-2 font-semibold text-slate-900">6단계 흐름</div>
          </div>
          <div className="rounded-3xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100">
            <div className="text-2xl">⚡</div>
            <div className="mt-2 font-semibold text-slate-900">속도 조절</div>
          </div>
          <div className="rounded-3xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100">
            <div className="text-2xl">⭐</div>
            <div className="mt-2 font-semibold text-slate-900">별점 진행도</div>
          </div>
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4 text-left">
          <h2 className="text-2xl font-bold text-slate-950">하네스 UI 스켈레톤</h2>
          <p className="text-sm leading-6 text-slate-600">
            이번 단계에서는 라우팅과 공통 UI만 준비합니다. 실제 레벨 화면과
            블록 에디터는 다음 phase에서 채웁니다.
          </p>
          <Button onClick={() => setIsModalOpen(false)} className="w-full">
            닫기
          </Button>
        </div>
      </Modal>
    </main>
  );
}

function PlaceholderScreen({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const location = useLocation();
  const params = useParams();

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
            {location.pathname}
          </span>
        </div>
        <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-slate-950">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        {params.id ? (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            현재 선택된 레벨 ID: <strong className="text-slate-950">{params.id}</strong>
          </p>
        ) : null}
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/demo"
          element={
            <PlaceholderScreen
              title="Interactive Demo"
              description="20초 체험 데모가 들어올 자리입니다."
            />
          }
        />
        <Route
          path="/levels"
          element={
            <PlaceholderScreen
              title="Level Select"
              description="레벨 선택과 진행도 요약이 들어올 자리입니다."
            />
          }
        />
        <Route
          path="/level/:id"
          element={
            <PlaceholderScreen
              title="Level Play"
              description="캔버스, 블록 팔레트, 실행 UI가 들어올 자리입니다."
            />
          }
        />
        <Route
          path="/completion"
          element={
            <PlaceholderScreen
              title="Completion"
              description="전체 완주 축하 화면이 들어올 자리입니다."
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
