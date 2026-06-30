# Physics Optional PYQ Plan — week of 2026-06-30

**Paper I · Mechanics · Topic: Rigid Body Dynamics — Inertia Tensor, Euler's Equations & the Symmetric Top**
**Fortnight F3 (30 Jun – 13 Jul): completing the Mechanics block.** This is the planned sequel to last fortnight's central-force set. With Lagrangian, Hamiltonian, and central-force already drilled, rigid-body dynamics is the one remaining heavily-repeated Paper I mechanics block. Finish it this week, and the mechanics section of Paper I is essentially covered end-to-end before we rotate to **Electromagnetism** next fortnight.

> **Why this topic now:** In UPSC Physics Paper I, rigid-body rotation reappears almost every year through one of three standard demands: (i) compute an **inertia tensor** and find **principal axes/moments**; (ii) derive **Euler's equations** and apply them to a **torque-free symmetric top** (Earth's free precession); (iii) the **heavy top / gyroscope** steady-precession formula. The 8 problems below cover all three. Master them and you can answer almost anything the rigid-body section asks.

---

## How to use this set (timed)

1. **Attempt first, closed-book, ~90 minutes.** Treat P1–P6 as 12–15 mark answers, P7 as a 10-mark numerical, P8 as a 15–20 mark derivation. Draw a labelled body-axes diagram every time — UPSC awards marks for the diagram and for stating the principal-axis assumption.
2. **Then** check against the worked solutions below.
3. Log every boxed result into your **Formula & Derivation Master Log** under *"Mechanics — Rigid Body."*

**Source / where to find the real papers:**
- **UPSC official site** → *Examination → Previous Year Question Papers* (`upsc.gov.in`). Download the **Physics Paper I** PDFs for the last ~20 years and search them for "moment of inertia", "inertia tensor", "principal axes", "Euler's equations", "symmetric top", "precession", "gyroscope".
- **Standard texts that mirror UPSC style:** Goldstein, *Classical Mechanics* Ch. 4–5 (the canonical source — UPSC questions are essentially these exercises); J.C. Upadhyaya, *Classical Mechanics* (rigid-body chapter); Takwale & Puranik for the tensor algebra and the cube/lamina problems.

> ⚠️ **Honesty note:** The 8 problems below are **representative UPSC-style** items built on the exact derivations and computations UPSC repeats. They are *not* claimed to be verbatim past questions. The *physics asked* is authentic and high-frequency; treat any specific wording as mine, not UPSC's. Pull the real Paper I PDFs from `upsc.gov.in` to practise exact phrasing and marks.

---

## Problems (attempt these timed, solutions at the end)

**P1 (the perennial one).** A uniform solid cube of mass $M$ and side $a$ has one corner at the origin and its three edges along the coordinate axes. (a) Compute the full moment-of-inertia tensor $I_{ij}$ about that corner. (b) Find the **principal moments of inertia** and the corresponding **principal axes**.

**P2.** State and prove (i) the **parallel-axis theorem in tensor form**, $I_{ij} = I_{ij}^{\text{cm}} + M\,(d^2\delta_{ij} - d_i d_j)$, and (ii) the **perpendicular-axis theorem** $I_z = I_x + I_y$ for a plane lamina.

**P3.** For a rigid body rotating about a fixed point with angular velocity $\boldsymbol\omega$, show that the angular momentum is $\mathbf L = \mathsf I\,\boldsymbol\omega$ and the kinetic energy is $T = \tfrac12\,\boldsymbol\omega\cdot\mathsf I\,\boldsymbol\omega = \tfrac12\,\boldsymbol\omega\cdot\mathbf L$. Hence show that **$\mathbf L$ is in general not parallel to $\boldsymbol\omega$**, and state the condition under which it is.

**P4.** Starting from $\left(\dfrac{d\mathbf L}{dt}\right)_{\text{space}} = \left(\dfrac{d\mathbf L}{dt}\right)_{\text{body}} + \boldsymbol\omega\times\mathbf L = \mathbf N$, derive **Euler's equations of motion** for a rigid body referred to its principal axes.

**P5.** Apply Euler's equations to a **torque-free symmetric top** ($I_1 = I_2 \neq I_3$, $\mathbf N = 0$). Show that the symmetry-axis component $\omega_3$ is constant and that the transverse part of $\boldsymbol\omega$ precesses about the body symmetry axis at angular rate $\Omega = \dfrac{(I_3 - I_1)}{I_1}\,\omega_3$. Estimate the period for the Earth.

**P6.** A **heavy symmetric top** spins rapidly about its symmetry axis (spin $\omega_3$, moment $I_3$) with its pivot a distance $l$ below the centre of mass, the axis making angle $\theta$ with the vertical. In the fast-top approximation, show that it undergoes **steady precession** about the vertical at rate $\dot\phi = \dfrac{Mgl}{I_3\,\omega_3}$, independent of $\theta$.

**P7 (numerical).** A bicycle-wheel gyroscope (treat as a thin ring, $I_3 = MR^2$) has $M = 4\ \text{kg}$, $R = 0.30\ \text{m}$, and spins at $30$ revolutions per second. Its axle is supported at one end, a distance $l = 0.10\ \text{m}$ from the wheel's centre. Find the **precession rate** and the **precession period**. (Take $g = 9.8\ \text{m s}^{-2}$.)

**P8 (König's theorem + a standard moment).** (a) Prove that the kinetic energy of a rigid body separates as $T = \tfrac12 M V_{\text{cm}}^2 + \tfrac12\,\boldsymbol\omega\cdot\mathsf I_{\text{cm}}\,\boldsymbol\omega$ (translational + rotational). (b) Derive the moment of inertia of a uniform solid sphere of mass $M$, radius $R$ about a diameter, $I = \tfrac25 MR^2$.

---

## Key formulas (add to the log)

| # | Formula | Meaning |
|---|---|---|
| 1 | $I_{ij} = \sum_\alpha m_\alpha\big(r_\alpha^2\delta_{ij} - x_{\alpha i}x_{\alpha j}\big)$ | inertia tensor (sum → integral for a continuum) |
| 2 | $\mathbf L = \mathsf I\,\boldsymbol\omega,\quad L_i = I_{ij}\omega_j$ | angular momentum |
| 3 | $T = \tfrac12\,\omega_i I_{ij}\omega_j = \tfrac12\,\boldsymbol\omega\cdot\mathbf L$ | rotational kinetic energy |
| 4 | $I_{ij}=I_{ij}^{\text{cm}}+M(d^2\delta_{ij}-d_id_j)$ | parallel-axis theorem (tensor form) |
| 5 | $I_z = I_x + I_y$ | perpendicular-axis theorem (lamina) |
| 6 | $I_1\dot\omega_1-(I_2-I_3)\omega_2\omega_3=N_1$ (+ cyclic) | Euler's equations (principal axes) |
| 7 | $\Omega=\dfrac{I_3-I_1}{I_1}\,\omega_3$ | body-frame precession, torque-free symmetric top |
| 8 | $\dot\phi=\dfrac{Mgl}{I_3\omega_3}$ | steady precession, fast heavy top |
| 9 | $T=\tfrac12 MV_{\text{cm}}^2+\tfrac12\,\boldsymbol\omega\cdot\mathsf I_{\text{cm}}\,\boldsymbol\omega$ | König's theorem |

**Standard moments to know cold:** ring $MR^2$ · disc $\tfrac12 MR^2$ · solid sphere $\tfrac25 MR^2$ · spherical shell $\tfrac23 MR^2$ · rod (centre) $\tfrac1{12}ML^2$ · rod (end) $\tfrac13 ML^2$ · solid cylinder $\tfrac12 MR^2$.

---
---

## Worked Solutions

### P1 — Inertia tensor of a uniform cube about a corner

Density $\rho = M/a^3$; the cube occupies $0\le x,y,z\le a$.

**Diagonal element $I_{xx}$:**
$$I_{xx}=\rho\int_0^a\!\!\int_0^a\!\!\int_0^a (y^2+z^2)\,dx\,dy\,dz.$$
The $x$-integral gives a factor $a$, and $\int_0^a\!\int_0^a (y^2+z^2)\,dy\,dz = \tfrac{a^3}{3}\,a + a\,\tfrac{a^3}{3} = \tfrac{2a^4}{3}$. Hence
$$I_{xx}=\rho\, a\cdot\frac{2a^4}{3}=\frac{2}{3}\rho a^5=\frac{2}{3}Ma^2,$$
and by symmetry $I_{xx}=I_{yy}=I_{zz}=\tfrac23 Ma^2$.

**Off-diagonal element $I_{xy}$:**
$$I_{xy}=-\rho\int_0^a\!\!\int_0^a\!\!\int_0^a xy\,dx\,dy\,dz=-\rho\Big(\frac{a^2}{2}\Big)\Big(\frac{a^2}{2}\Big)(a)=-\frac{\rho a^5}{4}=-\frac14 Ma^2,$$
and likewise every off-diagonal product equals $-\tfrac14 Ma^2$. Therefore
$$\boxed{\;\mathsf I=Ma^2\begin{pmatrix}\tfrac23 & -\tfrac14 & -\tfrac14\\[2pt]-\tfrac14 & \tfrac23 & -\tfrac14\\[2pt]-\tfrac14 & -\tfrac14 & \tfrac23\end{pmatrix}\;}$$

**(b) Principal moments.** Write $\mathsf I = Ma^2\big[\tfrac{11}{12}\,\mathbb 1 - \tfrac14\,\mathsf U\big]$, where $\mathsf U$ is the $3\times3$ matrix of all ones (check: diagonal $\tfrac{11}{12}-\tfrac14=\tfrac23$ ✓; off-diagonal $0-\tfrac14=-\tfrac14$ ✓). $\mathsf U$ has eigenvalue $3$ along $(1,1,1)$ and eigenvalue $0$ (doubly degenerate) in the plane $\perp(1,1,1)$. Hence
$$I_{\parallel}=Ma^2\Big(\tfrac{11}{12}-\tfrac14\cdot3\Big)=\frac16 Ma^2 \quad\text{(axis = body diagonal $(1,1,1)$)},$$
$$I_{\perp}=Ma^2\Big(\tfrac{11}{12}-0\Big)=\frac{11}{12}Ma^2 \quad\text{(any two axes $\perp$ to the diagonal, degenerate).}$$
**Check (trace invariance):** $\tfrac16+\tfrac{11}{12}+\tfrac{11}{12}=2 = 3\times\tfrac23$ ✓. So the cube behaves as a **symmetric top** about a corner, with its symmetry axis along the body diagonal.

---

### P2 — Parallel-axis (tensor) and perpendicular-axis theorems

**(i) Parallel axis.** Let $\mathbf r_\alpha = \mathbf R_\alpha + \mathbf d$, where $\mathbf R_\alpha$ is measured from the centre of mass and $\mathbf d$ is the (constant) displacement of the CM from the new origin. By definition $\sum_\alpha m_\alpha \mathbf R_\alpha = 0$. Then
$$I_{ij}=\sum_\alpha m_\alpha\big(r_\alpha^2\delta_{ij}-x_{\alpha i}x_{\alpha j}\big).$$
Substitute $x_{\alpha i}=X_{\alpha i}+d_i$ and expand. The cross terms $\sum_\alpha m_\alpha X_{\alpha i}$ vanish (CM condition), leaving
$$I_{ij}=\underbrace{\sum_\alpha m_\alpha\big(R_\alpha^2\delta_{ij}-X_{\alpha i}X_{\alpha j}\big)}_{I_{ij}^{\text{cm}}}+M\big(d^2\delta_{ij}-d_i d_j\big).$$
$$\boxed{\,I_{ij}=I_{ij}^{\text{cm}}+M\big(d^2\delta_{ij}-d_i d_j\big)\,}$$
For a single axis, the diagonal element reduces to the familiar $I = I_{\text{cm}} + Md_\perp^2$.

**(ii) Perpendicular axis.** For a lamina in the $xy$-plane, every mass element has $z=0$, so
$$I_z=\sum m(x^2+y^2),\quad I_x=\sum m\,y^2,\quad I_y=\sum m\,x^2\ \Rightarrow\ \boxed{I_z=I_x+I_y}.$$
(Valid **only** for a plane lamina, since it relies on $z=0$.)

---

### P3 — $\mathbf L=\mathsf I\boldsymbol\omega$, the kinetic energy, and why $\mathbf L\nparallel\boldsymbol\omega$

For a body rotating about a fixed point, each element has velocity $\mathbf v_\alpha=\boldsymbol\omega\times\mathbf r_\alpha$. The angular momentum is
$$\mathbf L=\sum_\alpha m_\alpha\,\mathbf r_\alpha\times(\boldsymbol\omega\times\mathbf r_\alpha)=\sum_\alpha m_\alpha\big[r_\alpha^2\boldsymbol\omega-(\mathbf r_\alpha\cdot\boldsymbol\omega)\mathbf r_\alpha\big],$$
using $\mathbf a\times(\mathbf b\times\mathbf a)=a^2\mathbf b-(\mathbf a\cdot\mathbf b)\mathbf a$. In components,
$$L_i=\sum_\alpha m_\alpha\big(r_\alpha^2\delta_{ij}-x_{\alpha i}x_{\alpha j}\big)\omega_j = I_{ij}\omega_j\ \Rightarrow\ \boxed{\mathbf L=\mathsf I\boldsymbol\omega.}$$

**Kinetic energy:**
$$T=\tfrac12\sum_\alpha m_\alpha v_\alpha^2=\tfrac12\sum_\alpha m_\alpha(\boldsymbol\omega\times\mathbf r_\alpha)\cdot(\boldsymbol\omega\times\mathbf r_\alpha)=\tfrac12\,\boldsymbol\omega\cdot\sum_\alpha m_\alpha\,\mathbf r_\alpha\times(\boldsymbol\omega\times\mathbf r_\alpha),$$
where the scalar-triple-product identity was used. The right-hand sum is exactly $\mathbf L$, so
$$\boxed{T=\tfrac12\,\boldsymbol\omega\cdot\mathbf L=\tfrac12\,\omega_i I_{ij}\omega_j.}$$

**Why $\mathbf L\nparallel\boldsymbol\omega$:** $\mathbf L=\mathsf I\boldsymbol\omega$ is parallel to $\boldsymbol\omega$ only if $\boldsymbol\omega$ is an **eigenvector** of $\mathsf I$, i.e. only when $\boldsymbol\omega$ points along a **principal axis** ($\mathsf I\boldsymbol\omega=I\boldsymbol\omega$). For a general $\boldsymbol\omega$, the off-diagonal terms tilt $\mathbf L$ away from $\boldsymbol\omega$, so $\mathbf L$ traces a cone in space and a steady rotation requires a time-varying applied torque — this is exactly the wobble of an unbalanced shaft.

---

### P4 — Euler's equations

Resolve $\mathbf L$ and $\mathbf N$ along the **body** principal axes, where $L_i=I_i\omega_i$ (the $I_i$ are constants, the principal moments). The space and body rates of change of any vector are related by
$$\left(\frac{d\mathbf L}{dt}\right)_{\text{space}}=\left(\frac{d\mathbf L}{dt}\right)_{\text{body}}+\boldsymbol\omega\times\mathbf L=\mathbf N.$$
Component 1 of $\boldsymbol\omega\times\mathbf L$ is $\omega_2 L_3-\omega_3 L_2=(I_3-I_2)\omega_2\omega_3$, and $\big(d\mathbf L/dt\big)_{\text{body},1}=I_1\dot\omega_1$. Collecting the three components,
$$\boxed{\begin{aligned}
I_1\dot\omega_1-(I_2-I_3)\,\omega_2\omega_3 &= N_1,\\
I_2\dot\omega_2-(I_3-I_1)\,\omega_3\omega_1 &= N_2,\\
I_3\dot\omega_3-(I_1-I_2)\,\omega_1\omega_2 &= N_3.
\end{aligned}}$$
These are **Euler's equations**. They are nonlinear (the $\omega_i\omega_j$ terms) and coupled by the *differences* of the principal moments.

---

### P5 — Torque-free symmetric top (Earth's free precession)

Set $\mathbf N=0$ and $I_1=I_2$ in Euler's equations.

**Third equation:** $I_3\dot\omega_3=(I_1-I_2)\omega_1\omega_2=0\Rightarrow \omega_3=\text{const.}$

**First two:** with $I_1=I_2$,
$$I_1\dot\omega_1=(I_1-I_3)\omega_2\omega_3,\qquad I_1\dot\omega_2=(I_3-I_1)\omega_3\omega_1.$$
Define the constant
$$\Omega\equiv\frac{(I_3-I_1)}{I_1}\,\omega_3.$$
Then $\dot\omega_1=-\Omega\,\omega_2$ and $\dot\omega_2=+\Omega\,\omega_1$. Differentiating: $\ddot\omega_1=-\Omega^2\omega_1$, so
$$\omega_1=\omega_\perp\cos\Omega t,\qquad \omega_2=\omega_\perp\sin\Omega t,\qquad \omega_\perp=\sqrt{\omega_1^2+\omega_2^2}=\text{const.}$$
The transverse part of $\boldsymbol\omega$ has **constant magnitude** and **rotates about the body symmetry axis** (the 3-axis) at angular rate
$$\boxed{\Omega=\frac{I_3-I_1}{I_1}\,\omega_3}$$
i.e. $\boldsymbol\omega$ sweeps out the **body cone**. (As seen in space, the symmetry axis and $\boldsymbol\omega$ both precess about the fixed $\mathbf L$.)

**Earth.** With the dynamical ellipticity $(I_3-I_1)/I_1\approx 1/305$ and $\omega_3\approx 1\ \text{cycle/day}$, the free (Euler) precession period is
$$T_{\text{Euler}}=\frac{2\pi}{\Omega}\approx 305\ \text{days}.$$
The observed **Chandler wobble** is $\sim$430 days; the difference is because the Earth is not perfectly rigid (elastic yielding lengthens the period). Stating "rigid prediction ≈ 305 days, observed ≈ 430 days due to non-rigidity" is exactly the kind of remark that earns the extra mark.

---

### P6 — Heavy symmetric top: steady precession (fast-top limit)

The top's weight $Mg$ acts at the CM, a distance $l$ from the pivot along the symmetry axis, giving a torque of magnitude
$$N=Mgl\sin\theta,$$
directed **horizontally**, perpendicular to the vertical plane containing the axis. In the fast-top (gyroscopic) approximation the spin angular momentum dominates, so $\mathbf L\approx I_3\omega_3\,\hat{\mathbf e}_3$ points along the symmetry axis. The torque changes only the *direction* of $\mathbf L$, swinging the axis around the vertical at precession rate $\dot\phi$. The horizontal component of $\mathbf L$ is $L\sin\theta=I_3\omega_3\sin\theta$, and it rotates at $\dot\phi$, so
$$\left|\frac{d\mathbf L}{dt}\right|=(I_3\omega_3\sin\theta)\,\dot\phi = N = Mgl\sin\theta.$$
The $\sin\theta$ cancels:
$$\boxed{\dot\phi=\frac{Mgl}{I_3\,\omega_3}}$$
independent of the tilt $\theta$. (Beyond this approximation the motion also **nutates** — a small nodding of $\theta$ superimposed on the steady precession.)

---

### P7 — Numerical: gyroscope precession

Ring: $I_3=MR^2=(4)(0.30)^2=0.36\ \text{kg m}^2.$
Spin: $\omega_3=30\times2\pi=188.5\ \text{rad s}^{-1}.$
Gravitational torque: $Mgl=(4)(9.8)(0.10)=3.92\ \text{N m}.$

$$\dot\phi=\frac{Mgl}{I_3\omega_3}=\frac{3.92}{(0.36)(188.5)}=\frac{3.92}{67.86}=0.0578\ \text{rad s}^{-1}.$$
$$T_{\text{prec}}=\frac{2\pi}{\dot\phi}=\frac{6.283}{0.0578}\approx 109\ \text{s}.$$

So the axle sweeps around the vertical roughly **once every 1.8 minutes**. Note the precession is slow because the spin angular momentum $I_3\omega_3\approx 67.9\ \text{J s}$ is large — the hallmark of the fast-top regime in which the formula is valid.

---

### P8 — König's theorem and the solid-sphere moment

**(a) Separation of kinetic energy.** Write each position as $\mathbf r_\alpha=\mathbf R+\mathbf r'_\alpha$, where $\mathbf R$ locates the CM and $\mathbf r'_\alpha$ is measured from it. Then $\mathbf v_\alpha=\mathbf V+\mathbf v'_\alpha$ with $\mathbf V=\dot{\mathbf R}$, and
$$T=\tfrac12\sum_\alpha m_\alpha v_\alpha^2=\tfrac12\sum_\alpha m_\alpha\big(V^2+2\,\mathbf V\cdot\mathbf v'_\alpha+v'^2_\alpha\big).$$
The cross term vanishes because $\sum_\alpha m_\alpha\mathbf v'_\alpha=\dfrac{d}{dt}\sum_\alpha m_\alpha\mathbf r'_\alpha=0$ (CM definition). Thus
$$T=\tfrac12 MV^2+\tfrac12\sum_\alpha m_\alpha v'^2_\alpha.$$
For rotation about the CM, $\mathbf v'_\alpha=\boldsymbol\omega\times\mathbf r'_\alpha$, and the second term is $\tfrac12\,\boldsymbol\omega\cdot\mathsf I_{\text{cm}}\,\boldsymbol\omega$ (exactly as in P3). Hence
$$\boxed{T=\tfrac12 MV_{\text{cm}}^2+\tfrac12\,\boldsymbol\omega\cdot\mathsf I_{\text{cm}}\,\boldsymbol\omega.}$$
This is why a rolling body's energy splits cleanly into translation of the CM plus rotation about it.

**(b) Solid sphere about a diameter.** Density $\rho=\dfrac{M}{\frac43\pi R^3}$. Use $I=\tfrac23\rho\displaystyle\int r^2\,dV$, valid for a body symmetric about the centre because $I_x=I_y=I_z=\tfrac13(I_x+I_y+I_z)$ and $I_x+I_y+I_z=2\sum m\,r^2$ (each Cartesian coordinate appears in two of the three diagonal moments). With $dV=4\pi r^2\,dr$,
$$\int_0^R r^2\,(4\pi r^2\,dr)=4\pi\frac{R^5}{5},\qquad I=\frac23\rho\cdot4\pi\frac{R^5}{5}=\frac23\cdot\frac{M}{\frac43\pi R^3}\cdot\frac{4\pi R^5}{5}=\boxed{\frac25 MR^2.}$$

---

## Recurring-pattern insights

1. **"Compute the tensor, then diagonalize."** The single most repeated rigid-body demand is to build an inertia tensor for a simple body (cube about a corner, rectangular lamina, an L-shaped or triangular system of point masses) and extract the **principal moments**. The cube-about-a-corner result — diagonal $\tfrac23 Ma^2$, off-diagonals $-\tfrac14 Ma^2$, principal moments $\tfrac16 Ma^2$ and $\tfrac{11}{12}Ma^2$ — is worth memorising outright; examiners love it because it tests the tensor, the off-diagonal integral, *and* eigenvalues in one question. Always sanity-check eigenvalues with the **trace** (sum of principal moments = trace of the tensor).

2. **The Euler → torque-free top → Earth chain.** "Derive Euler's equations" and "apply them to a symmetric top" travel together. The payoff line is the body-frame precession rate $\Omega=(I_3-I_1)\omega_3/I_1$ and its application to Earth's free (Euler) precession, ≈305 days for a rigid Earth vs the observed ≈430-day Chandler wobble. Knowing the *reason* for the discrepancy (Earth's elasticity) is a reliable extra-mark remark.

3. **Heavy top vs free top — don't confuse the two precessions.** Paper I frequently sets a numerical on the **heavy** top/gyroscope using $\dot\phi=Mgl/(I_3\omega_3)$ (torque-driven, precession *in space* about the vertical), right next to a conceptual part on the **torque-free** top (no torque, precession *in the body* about the symmetry axis). Label which is which in your answer — mixing them up is the most common way candidates lose marks here.

**Tip for this week:** Pin down the **standard moments-of-inertia table** (ring, disc, solid/hollow sphere, rod at centre/end, cylinder) so you can quote any of them instantly. Rigid-body numericals almost always *start* by assuming you know the relevant $I$ cold; a wrong or slowly-recalled moment poisons the entire answer. Build a one-line derivation for each (most follow from one integral plus the parallel- or perpendicular-axis theorem) so you can reconstruct any you blank on. Next fortnight we rotate out of mechanics into **Electromagnetism** — expect the PYQ set to open on Maxwell's equations, boundary conditions, and EM waves in media.

---

*Generated for the weekly Physics Optional PYQ plan. All 8 problems are representative UPSC-style items built on standard, repeatedly-tested derivations and computations — not verbatim past papers. Pull the actual Paper I PDFs from upsc.gov.in to practise exact wording and marking.*
