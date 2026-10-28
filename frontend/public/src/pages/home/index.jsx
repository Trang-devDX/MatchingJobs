import { ROUTES } from '../../constants/routes'

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="public-header"><a className="public-brand" href={ROUTES.HOME}>MatchingJobs</a><nav><a className="header-link" href={ROUTES.LOGIN}>Đăng nhập</a><a className="header-button" href={ROUTES.LOGIN}>Tìm việc ngay</a></nav></header>
      <section className="landing-hero"><div className="hero-copy"><p className="eyebrow">CƠ HỘI PHÙ HỢP, HÀNH TRÌNH TỐT HƠN</p><h1>Công việc tốt bắt đầu từ một kết nối đúng.</h1><p className="hero-description">Khám phá cơ hội nghề nghiệp phù hợp với kỹ năng, mục tiêu và cuộc sống của bạn.</p><div className="hero-actions"><a className="header-button" href={ROUTES.LOGIN}>Đăng nhập</a></div></div><div className="hero-visual" aria-hidden="true"><div className="visual-orbit orbit-one"></div><div className="visual-orbit orbit-two"></div><div className="visual-card"><span className="visual-icon">✦</span><span className="visual-lines"><i></i><i></i></span><span className="match-score">98% match</span></div><div className="floating-tag tag-top">Cơ hội mới</div><div className="floating-tag tag-bottom">Phù hợp với bạn</div></div></section>
      <section className="landing-points"><div><span>01</span><h2>Tìm cơ hội phù hợp</h2><p>Khám phá vị trí phù hợp với kỹ năng và định hướng của bạn.</p></div><div><span>02</span><h2>Kết nối tự tin</h2><p>Quản lý hồ sơ và theo dõi hành trình ứng tuyển của bạn.</p></div><div><span>03</span><h2>Tiến gần mục tiêu</h2><p>Bắt đầu một bước mới trong sự nghiệp cùng MatchingJobs.</p></div></section>
      <footer className="landing-footer">© {new Date().getFullYear()} MatchingJobs <a href={ROUTES.LOGIN}>Đăng nhập ứng viên</a></footer>
    </main>
  )
}
