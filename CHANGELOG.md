# HumanPlus-1000 Website — Changelog

> 本日志基于项目 Git 提交历史（共 23 个 commit，时间跨度 2026-09-11 → 2026-09-21）与当前代码结构整理而成，已将多个零散 / 重复提交合并为有意义的功能迭代阶段，并忽略了无意义的临时测试提交。版本号按时间顺序自定（V1.0 起）。
>
> 部署源：`humanplus-ai/HumanPlus1000.github.io`，GitHub Pages 由 GitHub Actions（`deploy.yml`）自动发布。技术栈：React 18 + Vite 5 + Tailwind 3，所有可编辑文案集中在 `src/data/site.js`，每个 section = `src/components/sections/XxxSection.jsx`。

---

## 详细版 Changelog

### V1.0 — 项目初始化 & React 重写
**时间：2026-09-11**

- **基础架构**：将最初由 Kiki 上传的静态文件（`index.md` 数据集条目 + `index.html`）整体重写为 **React 18 + Vite + Tailwind** 单页应用。
- **基础设施**：引入 `.github/workflows/deploy.yml`（GitHub Actions 自动部署 GitHub Pages）、`package.json`、`vite.config.js`、`tailwind.config.js`、`postcss.config.js`、`LICENSE`、`README.md`、`.gitignore`；合并远端历史保留本地重写；切换 Pages 源到 Actions 并完成首次部署（commit `c5f494f`）。
- **页面 / 模块**：初始仅 **3 个 section** —— `HeroSection`（封面/大标题/统计）、`DemoSection`（LIFE CAPTURE）、`OverviewSection`（OVERVIEW），外加 `Nav` 与 `Footer` 布局。
- **UI / 视觉设计**：确立黑底（#0a0a0a）基调；内置 `.dot-grid` 点阵、`.noise` 噪点、`.hero-vignette` 径向暗角、`.nav-glass` 毛玻璃导航；`Reveal` 滚动入场动画（threshold 0.1）、`SectionLabel`、`StatBlock` 等基础组件；媒体占位目录（`public/images|videos` 的 `.gitkeep`）。
- **文案 / 品牌**：数据集名 `HumanPlus1000`（无连字符）；站点 wordmark 为 `HumanPlus.AI`；Hero 大标题以拼词形式呈现为「HumanPlus 1000 -Hour」（pre/accent/post 分段）；Overview 正文为 3 段长文案。
- **数据集 / 统计**：初建 `datasetStats`（1000+ 小时、100+ 地点、500+ 任务、200+ 人），作为全站统计单一数据源。

### V1.1 — 三大内容模块补全 & 首页视觉精炼
**时间：2026-09-12**

- **页面 / 模块**：新增 **DOWNLOAD（OPEN SOURCE）**、**DATASET（MULTIMODAL DATA）**、**ACTIVITIES（REPRESENTATIVE TASKS）** 三个模块，主页从 3 段扩展为 **6 段**（Hero / Demo / Overview / Dataset / Activities / Download）。
- **UI / 视觉设计**：Hero 视觉精炼（更换 `hero/cover.png` 封面）；修复锚点滚动偏移（全局 `scroll-padding-top: 5rem`，对齐固定 64px 导航）；调整 `tailwind.config.js` 主题与 `StatBlock` 样式；`animations.css` / `index.css` 打磨。
- **文案 / 品牌**：此阶段 commit message 与文案中出现 `Human1000` 简写变体（后续被统一）。
- **功能 / 交互**：媒体占位框（VIDEO PLACEHOLDER / IMAGE PLACEHOLDER）在各模块落地。

### V1.2 — 全站视频 / 图片素材大替换 & 品牌名统一
**时间：2026-09-14**（当日连续 7 次提交）

- **视频 / 图片素材变化（集中替换）**：
  - Hero：视频历经 `HumanV2.mp4 → V3.mp4 → HeroV5.mp4` 多轮迭代；新增 `hero_poster.png` 首帧海报（避免黑屏闪烁）。
  - Demo：主视频替换为 `HeroV5.mp4`（封面 `HumanHeroV5.jpg`）。
  - Overview：视频替换为 `herov2.mp4` → 后续 `HumanHeroV5.mp4`。
  - Activities：新增 **6 个代表性任务视频** `tasks/01–06.mp4`（洗碗、扫地、备茶、叠衣、端盘、工件处理）。
  - Multimodal：新增 `Motion.mp4` / `Visual.mp4` 两个模态视频。
- **功能 / 交互**：「优化视频加载」（commit `4218944`）——引入首帧海报 + 滚动进入视口后再播放的懒加载策略，提升首屏性能。
- **文案 / 品牌**：**品牌名统一**——9/14 晚起全部统一为 **`HumanPlus-1000`**（带连字符），并沿用至今；同步更新 `index.html` / `index.md`。
- **页面 / 模块**：`HeroSection` / `OverviewSection` / `MultimodalSection` / `RepresentativeTasksSection` / `DemoSection` 与 `site.js` 同步更新。

### V1.3 — DEMO 2×2 视频网格
**时间：2026-09-16**

- **页面 / 模块**：DEMO（LIFE CAPTURE）模块主视频下方新增 **2×2 示例视频网格**（`videos/demo/samples/sample-01–04.mp4`（含 poster）），丰富 Demo 展示层次。
- ⚠️ **后续变更**：该 2×2 网格在 V1.4（9/20 大重构）随 `DemoSection` 重写被移除，DEMO 模块最终只保留「标签 → 标题 → 描述 → 主视频」结构；相关 sample 素材仍保留在 `public/videos/demo/samples/` 但已无引用。

### V1.4 — Research 模块 & Products 子页面 & Multimodal 轮播
**时间：2026-09-20**

- **页面 / 模块（重大扩展）**：
  - 全新 **RESEARCH** 模块（论文展示：编号 → venue 行 → teaser 图 → 标题 → 描述 → 链接）。
  - 全新 **Products 子页面**（`/#/products` 独立路由，含 Motion-0 服装 + Vision-0 头环两个 band）。
  - Multimodal 新增 **9 视频 coverflow 轮播**（`visualizations/sample-01–09.mp4` + 对应 poster）。
- **导航 / 路由**：`Nav` 增加 Products 链接；新增 `useHashRoute` 支持首页锚点（`#overview` 等）与子页面（`#/products`）混合路由；`App.jsx` 组合结构扩展。
- **UI / 视觉 / 组件**：新增 `VideoCarousel`（纯 CSS 变量 `--cf-n` 驱动的 three-up coverflow，仅圆心 slide 挂 src 播放、懒加载）、`ProductVisual`（透明底产品图无框展示）。
- **视频 / 图片素材**：新增 9 段 visualization 视频 + 9 张 poster；产品透明 PNG（`motion-0.png`、`vision-0.png`，由影棚浅底抠图得到）。
- **功能 / 交互**：coverflow 轮播左右切换 + 分页点，移动端一次仅显示一个。

### V1.5 — Overview 厨房v3 & 单轮播 & Research meta
**时间：2026-09-20**

- **视频 / 图片素材**：Overview 视频替换为 **`kitchen-v3.mp4`**（封面 `kitchen-v3-cover.jpg`），更新 `vision-0.png`。
- **功能 / 交互（重要）**：Overview 视频 **带原声、点击播放、不自动播**（浏览器禁止非静音自动播放，故改为用户手势触发）；轮播改为 **single-clip 单视频展示**。
- **UI / 视觉**：Research 增加 **meta row**（编号与 venue 同行对齐）；Products 细节调整。
- **页面 / 模块**：`OverviewSection` / `MultimodalSection` / `ResearchSection` / `VideoCarousel` / `site.js` / `pages/Products` 同步打磨；`animations.css` / `index.css` 微调。

### V1.6 — Coverflow 轮播打磨 & Research teaser / 论文文案
**时间：2026-09-20**

- **UI / 视觉**：Coverflow 轮播参数打磨（`cf-*` CSS 变量：active 宽度、step、侧边缩放、时长/缓动；移动端更紧凑的三连布局）。
- **视频 / 图片素材**：新增 Research **teaser 图** `research/01.png`、`02.jpg`、`03.jpg`（16:9，避免裁切）。
- **文案**：更新 3 篇论文信息 —— 01 SIGGRAPH Asia 2026 *CLOTHO*、02 SIGGRAPH 2025 *Transformer IMU Calibrator*（Best Paper Award）、03 CVPR 2024 *Loose Inertial Poser*。

### V1.7 — Motion-0 Banner & Technical Specifications
**时间：2026-09-20**

- **页面 / 模块**：Motion-0 band 上方新增 **全宽 lifestyle banner**（`products/motion-0-banner.jpg`，4px 圆角）；新增 **TECHNICAL SPECIFICATIONS** 模块（Motion-0 + Vision-0 参数表，暗色发丝线分隔，非面板网格）。
- **UI / 视觉**：技术规格表采用 hairline 分隔的 label→value 竖排，关键数字（11-IMU、30 Hz、10 h、165°、3840×1200、30 fps）以品牌蓝 `#589BF9` 高亮。

### V1.8 — Reconstruction 独立模块 & 页面细化
**时间：2026-09-20**

- **页面 / 模块**：将原本内嵌于 Overview 的 9-clip 轮播 **独立为 RECONSTRUCTION VISUALIZATION section**（三层标题块：kicker `RECONSTRUCTION` / 标题 `VISUALIZATION` / 描述）；Dataset（MULTIMODAL DATA）因此收敛为 01 Visual + 02 Human Motion（移除 03，避免轮播重复出现）。
- **UI / 视觉 / 文案**：Products / Overview / Research 页面进一步细化；`.gitignore` 忽略本地临时构建产物（dist_*、_tmp_* 等）。

### V1.9 — 产品规格表精简（移除 IMU Sensor 行）
**时间：2026-09-21**

- **文案 / 数据**：从 Motion-0 与 Vision-0 的 `productSpecs` 表中移除 **IMU Sensor 相关行**，精简技术规格，突出核心参数。

### V2.0 — 玻璃拟态卡片皮肤（实验性）
**时间：2026-09-21**

- **UI / 视觉（视觉风格分水岭）**：新增 **共享毛玻璃卡片皮肤** `glass-card` / `glass-card--lift`（blur + saturate + 高光 + 斜切边缘 + 方向性内阴影）；应用到 **RESEARCH / ACTIVITIES / DATASET / DOWNLOAD**；Research 的「More」与 Download 的「ACCESS DATASET」改为 **蓝色玻璃胶囊**（`research-more-glass`，品牌蓝 `#589BF9` 半透明）。
- ⚠️ 代码注释明确标注该皮肤为 **可逆实验（[TEST]）**，提供一键回退指引（删除样式块 + 移除类即可还原）。

### V2.1 — 玻璃拟态微调 & Hero stats 还原
**时间：2026-09-21**

- **UI / 视觉**：为 LIFE CAPTURE（DEMO）视频加 **玻璃框**；OVERVIEW 改为 **单玻璃布局**；**Hero subtitle 保持原有两行行距**；**Hero stats 还原为原始卡片样式**（撤销上一版的玻璃化处理）。
- **功能 / 交互 / 部署**：本轮为本地玻璃样式微调后部署，标志当前线上版本。

---

## 精简版 Changelog（README / 项目文档用）

> 复制以下内容到 `README.md` 或项目文档即可。

### Changelog

- **V1.0** (2026-09-11) — 项目初始化：由静态页重写为 React+Vite+Tailwind 单页站，配置 GitHub Actions 自动部署 Pages；初版含 Hero / Demo / Overview 三模块与 Nav/Footer。
- **V1.1** (2026-09-12) — 补全 DOWNLOAD、DATASET、ACTIVITIES 三模块（主页扩至 6 段）；精炼 Hero 视觉，修复锚点滚动偏移。
- **V1.2** (2026-09-14) — 全站视频/图片素材大替换（Hero V2→V5、6 个任务视频、Multimodal 双模态）；首帧海报 + 懒加载优化；品牌名统一为 `HumanPlus-1000`。
- **V1.3** (2026-09-16) — DEMO 模块增加 2×2 示例视频网格（后续于 V1.4 移除）。
- **V1.4** (2026-09-20) — 模块化大扩展：新增 RESEARCH 模块、Products 子页面（`#/products`）、Multimodal 9 视频 coverflow 轮播与路由系统。
- **V1.5** (2026-09-20) — Overview 换为带原声 `kitchen-v3` 视频（点击播放）；轮播改为单视频展示；Research 增加 meta 行。
- **V1.6** (2026-09-20) — Coverflow 轮播参数打磨；新增 Research teaser 图与 3 篇论文文案（SIGGRAPH / CVPR）。
- **V1.7** (2026-09-20) — 新增 Motion-0 全宽 banner 与 TECHNICAL SPECIFICATIONS 规格模块。
- **V1.8** (2026-09-20) — Reconstruction 独立为 RECONSTRUCTION VISUALIZATION section；Dataset 收敛为双模态；忽略本地临时产物。
- **V1.9** (2026-09-21) — 从产品规格表移除 IMU Sensor 行。
- **V2.0** (2026-09-21) — 引入实验性共享毛玻璃卡片皮肤，应用于 RESEARCH / ACTIVITIES / DATASET / DOWNLOAD；More / ACCESS DATASET 改为蓝色玻璃胶囊（可逆）。
- **V2.1** (2026-09-21) — 玻璃样式微调：LIFE CAPTURE 玻璃框、OVERVIEW 单玻璃布局；Hero stats 还原原始卡片。
