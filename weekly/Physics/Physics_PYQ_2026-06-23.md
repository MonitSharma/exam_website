# Physics Optional PYQ Plan — week of 2026-06-23

**Paper I · Mechanics · Topic: Central Force Motion & the Kepler Problem**
**Fortnight F2 (16–29 Jun): Mechanics.** This set is the natural sequel to last week's Hamiltonian drill, which ended at *"reduce the central-force problem to an effective 1-D radial problem."* This week you finish that job: orbits, conics, stability, Kepler's laws, and Rutherford scattering.

> **Why this topic now:** Central force is the single most-repeated mechanics theme in UPSC Physics Paper I. In almost every year some combination of {orbit equation, conic-section orbit, effective potential / orbit stability, Kepler's laws, reduced mass, Rutherford cross-section} appears. Master these 8 and you cover most of what Paper I can throw at the central-force / two-body section.

---

## How to use this set (timed)

1. **Attempt first, closed-book, ~90 minutes.** Treat P1–P6 as 12–15 mark answers, P7 as a 10-marker, P8 as a 20-marker. Write full steps with labelled diagrams (UPSC gives marks for the diagram and for stating assumptions).
2. **Then** check against the worked solutions below.
3. Log every boxed formula and every "show that" into your **Formula & Derivation Master Log** under *"Mechanics — Central Force."*

**Source / where to find the real papers:**
- **UPSC official site** → *Examination → Previous Year Question Papers* (`upsc.gov.in`). Download the **Physics Paper I** PDFs for the last ~20 years and search them for "central force", "orbit", "Kepler", "Rutherford", "reduced mass". (Don't expect me to reprint copyrighted papers — pull them from here.)
- **Standard texts that mirror the UPSC style:** Goldstein, *Classical Mechanics* Ch. 3 (the canonical source — UPSC questions are essentially Ch. 3 exercises); J.C. Upadhyaya, *Classical Mechanics* Ch. on central forces; Takwale & Puranik for the orbit/stability algebra.

> ⚠️ **Honesty note:** The 8 problems below are **representative UPSC-style** problems built on the exact derivations UPSC repeats. They are *not* claimed to be verbatim past questions. The *physics asked* is authentic and high-frequency; treat any specific wording as mine, not UPSC's.

---

## Problems (attempt these timed, solutions at the end)

**P1 (warm-up).** Show that for any central force the angular momentum is conserved and the motion is confined to a plane. Hence prove Kepler's second law (the radius vector sweeps equal areas in equal times), i.e. the areal velocity is constant.

**P2.** Starting from the radial equation of motion in plane polar coordinates, substitute $u = 1/r$ and derive the **Binet (differential orbit) equation**
$$\frac{d^2u}{d\theta^2} + u = -\frac{m}{\ell^2 u^2}\, f\!\left(\tfrac1u\right),$$
where $\ell$ is the conserved angular momentum and $f(r)$ the radial force.

**P3.** Using the Binet equation for the attractive inverse-square force $f(r) = -k/r^2$ $(k>0)$:
(a) show that the orbit is a conic section $r = \dfrac{p}{1 + e\cos\theta}$, and identify the semi-latus rectum $p$;
(b) show that the eccentricity is $e = \sqrt{1 + \dfrac{2E\ell^2}{mk^2}}$ and classify the orbits (ellipse / parabola / hyperbola / circle) by the sign of the total energy $E$.

**P4.** Define the effective potential $V_{\text{eff}}(r)$ for central motion. Obtain the condition for a **stable** circular orbit. Apply it to a power-law attractive force $f(r) = -k/r^{\,n}$ and show that stable circular orbits exist only for $n < 3$.

**P5.** Derive **Kepler's third law** $T^2 = \dfrac{4\pi^2}{G(M+m)}\,a^3$ for elliptical motion under gravity, where $a$ is the semi-major axis. State clearly where the reduced mass enters.

**P6.** A particle moves under the attractive **inverse-cube** force $f(r) = -k/r^3$. Using the Binet equation, find the orbits and obtain the condition (on $\ell$, $m$, $k$) under which the orbit is a **spiral** that falls into the centre.

**P7 (numerical).** A planet moves in an elliptical orbit of eccentricity $e = 0.5$ about the Sun. Find (i) the ratio of its speeds at perihelion and aphelion, and (ii) the ratio of its kinetic energies at those two points. State the conservation law you use.

**P8 (UPSC-level, "show that").** Derive the **Rutherford differential scattering cross-section** for a particle of energy $E$ scattered by a repulsive Coulomb potential. Show that
$$\frac{d\sigma}{d\Omega} = \frac14\left(\frac{k}{2E}\right)^2 \csc^4\!\frac{\theta}{2}, \qquad k = \frac{Zze^2}{4\pi\varepsilon_0}.$$

---

## Key formulas (add to the log)

| # | Formula | Meaning |
|---|---|---|
| 1 | $\ell = m r^2\dot\theta = \text{const}$ | angular momentum conserved (central force) |
| 2 | $\dfrac{dA}{dt} = \dfrac{\ell}{2m} = \text{const}$ | Kepler's 2nd law (areal velocity) |
| 3 | $\dfrac{d^2u}{d\theta^2}+u = -\dfrac{m}{\ell^2 u^2}f(1/u)$ | Binet / orbit equation, $u=1/r$ |
| 4 | $V_{\text{eff}}(r)=V(r)+\dfrac{\ell^2}{2mr^2}$ | effective (radial) potential |
| 5 | $E=\tfrac12 m\dot r^2 + V_{\text{eff}}(r)$ | energy in the 1-D radial problem |
| 6 | $r=\dfrac{p}{1+e\cos\theta},\quad p=\dfrac{\ell^2}{mk}$ | conic-section orbit (inverse-square) |
| 7 | $e=\sqrt{1+\dfrac{2E\ell^2}{mk^2}}$ | eccentricity ↔ energy |
| 8 | $\mu=\dfrac{m_1 m_2}{m_1+m_2}$ | reduced mass (two-body → one-body) |
| 9 | $b=\dfrac{k}{2E}\cot\dfrac{\theta}{2}$ | impact parameter ↔ scattering angle (Coulomb) |

---
---

## Worked Solutions

### P1 — Angular momentum, planar motion, Kepler's 2nd law

A central force has the form $\mathbf F = f(r)\,\hat{\mathbf r}$ — always along the line joining particle and centre.

**Torque about the centre:**
$$\boldsymbol\tau = \mathbf r\times\mathbf F = \mathbf r\times f(r)\hat{\mathbf r} = f(r)\,(\mathbf r\times\hat{\mathbf r}) = 0,$$
since $\mathbf r \parallel \hat{\mathbf r}$. Hence
$$\frac{d\mathbf L}{dt} = \boldsymbol\tau = 0 \;\Rightarrow\; \mathbf L = \mathbf r\times m\mathbf v = \text{constant}.$$

**Planar motion:** $\mathbf L$ is a fixed vector, and $\mathbf r \perp \mathbf L$ at all times (since $\mathbf L = \mathbf r\times m\mathbf v$). A position vector forever perpendicular to a *fixed* direction lies in the plane through the centre normal to $\mathbf L$. So the motion is confined to a plane. Use plane polar coordinates $(r,\theta)$ in that plane.

**Areal velocity.** In time $dt$ the radius vector sweeps a thin triangle of area
$$dA = \tfrac12\, r\,(r\,d\theta) = \tfrac12 r^2\,d\theta \;\Rightarrow\; \frac{dA}{dt} = \tfrac12 r^2\dot\theta.$$
The magnitude of angular momentum is $\ell = m r^2\dot\theta$, so
$$\boxed{\;\frac{dA}{dt} = \frac{\ell}{2m} = \text{constant}\;}$$
Equal areas are swept in equal times — **Kepler's second law**. Note it holds for *any* central force, not just gravity.

---

### P2 — The Binet (orbit) equation

Lagrangian in the plane: $L = \tfrac12 m(\dot r^2 + r^2\dot\theta^2) - V(r)$.

- $\theta$ is cyclic $\Rightarrow p_\theta = m r^2\dot\theta = \ell$ (constant). ✔
- Radial equation: $\dfrac{d}{dt}(m\dot r) - m r\dot\theta^2 = -\dfrac{dV}{dr} = f(r)$, i.e.
$$m\ddot r - \frac{\ell^2}{m r^3} = f(r), \qquad \text{using } \dot\theta = \frac{\ell}{mr^2}.$$

Change variable to $u = 1/r$ and independent variable from $t$ to $\theta$:
$$\dot r = \frac{dr}{d\theta}\dot\theta = \left(-\frac{1}{u^2}\frac{du}{d\theta}\right)\!\left(\frac{\ell u^2}{m}\right) = -\frac{\ell}{m}\frac{du}{d\theta},$$
$$\ddot r = \frac{d\dot r}{d\theta}\dot\theta = \left(-\frac{\ell}{m}\frac{d^2u}{d\theta^2}\right)\!\left(\frac{\ell u^2}{m}\right) = -\frac{\ell^2 u^2}{m^2}\frac{d^2u}{d\theta^2}.$$

Insert into the radial equation:
$$m\left(-\frac{\ell^2 u^2}{m^2}\frac{d^2u}{d\theta^2}\right) - \frac{\ell^2 u^3}{m} = f(1/u).$$
Divide through by $-\ell^2 u^2/m$:
$$\boxed{\;\frac{d^2u}{d\theta^2} + u = -\frac{m}{\ell^2 u^2}\,f\!\left(\frac1u\right)\;}$$
This is the **Binet equation**. Given the orbit $r(\theta)$ it yields the force; given the force it yields the orbit.

---

### P3 — Inverse-square orbit is a conic; eccentricity ↔ energy

**(a) Orbit.** For $f(r) = -k/r^2$, $\;f(1/u) = -k u^2$. The Binet RHS becomes
$$-\frac{m}{\ell^2 u^2}(-k u^2) = \frac{mk}{\ell^2}.$$
So
$$\frac{d^2u}{d\theta^2} + u = \frac{mk}{\ell^2}\quad(\text{constant}).$$
This is SHM in $u$ about the value $mk/\ell^2$. General solution:
$$u(\theta) = \frac{mk}{\ell^2}\bigl(1 + e\cos\theta\bigr),$$
(choosing the $\theta$-origin at perihelion so the phase is zero; $e$ is the integration-constant amplitude scaled by $mk/\ell^2$). Inverting,
$$\boxed{\,r(\theta) = \frac{p}{1 + e\cos\theta}, \qquad p = \frac{\ell^2}{mk}\,}$$
which is the polar equation of a **conic section** with focus at the centre of force; $p$ is the **semi-latus rectum**.

**(b) Eccentricity from energy.** Energy is conserved:
$$E = \tfrac12 m\dot r^2 + \frac{\ell^2}{2mr^2} - \frac{k}{r}.$$
At a turning point (perihelion/aphelion) $\dot r = 0$. Evaluate at perihelion $r_{\min} = p/(1+e)$. Substituting $p = \ell^2/(mk)$ and simplifying (algebra below):
$$E = \frac{\ell^2}{2mr^2} - \frac{k}{r}\Bigg|_{r=r_{\min}} = \frac{mk^2}{2\ell^2}\bigl(e^2 - 1\bigr).$$
Solving for $e$:
$$\boxed{\,e = \sqrt{1 + \frac{2E\ell^2}{mk^2}}\,}$$

*Algebra check:* with $r_{\min}=p/(1+e)$ and $p=\ell^2/mk$, $\;\frac{1}{r_{\min}}=\frac{mk}{\ell^2}(1+e)$. Then
$\frac{\ell^2}{2m}\frac1{r_{\min}^2} = \frac{\ell^2}{2m}\frac{m^2k^2}{\ell^4}(1+e)^2 = \frac{mk^2}{2\ell^2}(1+e)^2$, and $\frac{k}{r_{\min}} = \frac{mk^2}{\ell^2}(1+e)$. So
$E = \frac{mk^2}{2\ell^2}\bigl[(1+e)^2 - 2(1+e)\bigr] = \frac{mk^2}{2\ell^2}(1+e)(e-1) = \frac{mk^2}{2\ell^2}(e^2-1).$ ✔

**Classification (the part UPSC loves):**

| Total energy $E$ | Eccentricity $e$ | Orbit |
|---|---|---|
| $E < 0$ (specifically $-\tfrac{mk^2}{2\ell^2}<E<0$) | $0<e<1$ | **ellipse** (bound) |
| $E = -\dfrac{mk^2}{2\ell^2}$ | $e = 0$ | **circle** (minimum of $V_{\text{eff}}$) |
| $E = 0$ | $e = 1$ | **parabola** (escape, marginal) |
| $E > 0$ | $e > 1$ | **hyperbola** (unbound, scattering) |

---

### P4 — Effective potential and stability of circular orbits

Using $\ell = mr^2\dot\theta$, the energy reads
$$E = \tfrac12 m\dot r^2 + \underbrace{V(r) + \frac{\ell^2}{2mr^2}}_{V_{\text{eff}}(r)}.$$
The radial motion is that of a 1-D particle in $V_{\text{eff}}$. The extra term $\ell^2/2mr^2$ is the **centrifugal barrier**.

**Circular orbit:** $\dot r = 0$ at the radius $r_0$ where $V_{\text{eff}}'(r_0)=0$:
$$V'(r_0) - \frac{\ell^2}{mr_0^3} = 0 \;\Rightarrow\; -f(r_0) = \frac{\ell^2}{mr_0^3}.$$

**Stability:** the circular orbit is stable iff $V_{\text{eff}}$ is a *minimum*, i.e.
$$\boxed{\,V_{\text{eff}}''(r_0) > 0\,}, \qquad V_{\text{eff}}'' = V'' + \frac{3\ell^2}{mr^4}.$$

**Power-law force** $f(r) = -k/r^{\,n}$ $(k>0)$, so $V(r) = -\dfrac{k}{(n-1)r^{\,n-1}}$, giving $V'(r) = \dfrac{k}{r^{\,n}}$ and $V''(r) = -\dfrac{nk}{r^{\,n+1}}$.

From the circular condition $\dfrac{\ell^2}{mr_0^3} = V'(r_0) = \dfrac{k}{r_0^{\,n}}$, hence $\dfrac{\ell^2}{m} = k\,r_0^{\,3-n}$. Then
$$V_{\text{eff}}''(r_0) = -\frac{nk}{r_0^{\,n+1}} + \frac{3}{r_0^4}\cdot\frac{\ell^2}{m} = -\frac{nk}{r_0^{\,n+1}} + \frac{3k\,r_0^{\,3-n}}{r_0^4} = \frac{k}{r_0^{\,n+1}}\,(3-n).$$
Therefore
$$V_{\text{eff}}''(r_0) > 0 \iff \boxed{\,n < 3\,}.$$
Inverse-square ($n=2$): stable. Inverse-cube ($n=3$): marginal (neutral). Steeper than inverse-cube ($n>3$): unstable — any perturbation spirals in or out. A small-oscillation bonus: the radial perturbation frequency is $\omega_r^2 = V_{\text{eff}}''(r_0)/m$, and closed orbits require $\omega_r/\dot\theta$ rational (Bertrand's theorem singles out $n=2$ and the linear $n=-1$ Hooke force).

---

### P5 — Kepler's third law

For a bound (elliptical) orbit, integrate the areal-velocity law over one full period $T$:
$$A_{\text{ellipse}} = \int_0^T \frac{dA}{dt}\,dt = \frac{\ell}{2m}\,T.$$
The area of an ellipse is $A = \pi a b$ with semi-axes $a$ (major) and $b$ (minor). Hence
$$\pi a b = \frac{\ell}{2m}T \;\Rightarrow\; T = \frac{2\pi m\,ab}{\ell}.$$
Use the geometric relation $b^2 = a\,p$ (semi-latus rectum $p = b^2/a$) with $p = \ell^2/(mk)$:
$$b^2 = a\cdot\frac{\ell^2}{mk}.$$
Square the period:
$$T^2 = \frac{4\pi^2 m^2 a^2 b^2}{\ell^2} = \frac{4\pi^2 m^2 a^2}{\ell^2}\cdot\frac{a\ell^2}{mk} = \frac{4\pi^2 m\,a^3}{k}.$$
For gravity between bodies of mass $M$ and $m$, the force constant is $k = G M m$ and the "$m$" appearing in the dynamics is the **reduced mass** $\mu = \frac{Mm}{M+m}$, while $k = G M m = G(M+m)\mu$. Substituting $m\to\mu$ and $k = G(M+m)\mu$:
$$\boxed{\,T^2 = \frac{4\pi^2}{G(M+m)}\,a^3\,}$$
For $M \gg m$ (planet around Sun) this reduces to $T^2 = \dfrac{4\pi^2}{GM}a^3$, i.e. $T^2 \propto a^3$ — **Kepler's third law**. The $(M+m)$ correction is exactly why the "constant" in $T^2/a^3$ differs slightly between planets.

---

### P6 — Inverse-cube force: the Cotes spiral

For $f(r) = -k/r^3$, $\;f(1/u) = -k u^3$. Binet RHS:
$$-\frac{m}{\ell^2 u^2}(-k u^3) = \frac{mk}{\ell^2}\,u.$$
So the orbit equation is *homogeneous*:
$$\frac{d^2u}{d\theta^2} + u = \frac{mk}{\ell^2}u \;\Rightarrow\; \frac{d^2u}{d\theta^2} + \left(1 - \frac{mk}{\ell^2}\right)u = 0.$$
Let $\beta^2 \equiv 1 - \dfrac{mk}{\ell^2}$. Three regimes:

1. **$\ell^2 > mk$** $(\beta^2 > 0)$: $u = A\cos(\beta\theta + \delta)$ — a bounded, **precessing rosette** orbit ($r$ oscillates between finite limits; perihelion advances unless $\beta=1$).
2. **$\ell^2 = mk$** $(\beta = 0)$: $u = A\theta + B$, i.e. $r = 1/(A\theta+B)$ — a **reciprocal spiral** (a Cotes spiral); the particle spirals into the centre as $\theta\to\infty$.
3. **$\ell^2 < mk$** $(\beta^2 < 0)$: write $\beta^2 = -\gamma^2$, then $u = A e^{\gamma\theta} + B e^{-\gamma\theta}$. Taking the in-falling branch $u = A e^{\gamma\theta}$ gives
$$r = \frac{1}{A}\,e^{-\gamma\theta},$$
an **equiangular (logarithmic) spiral** — the particle spirals into the force centre.

**Spiral / capture condition:**
$$\boxed{\,\ell^2 \le mk \;\Longrightarrow\; \text{orbit spirals into the centre}\,}$$
This is the dynamical counterpart of P4's result that $n=3$ is the marginal case: for the inverse-cube force there is no stable circular orbit, and if the angular momentum is too small the centrifugal barrier cannot hold the particle off the centre. (This is exactly the "exponential spiral" asked about in the 15 Jun mock, Q1(a).)

---

### P7 — Perihelion/aphelion speed ratio (numerical)

**Conservation law:** at perihelion and aphelion the velocity is *perpendicular* to the radius vector, so the angular momentum magnitude is simply $\ell = m v r$. Conservation of $\ell$ gives
$$m v_p r_p = m v_a r_a \;\Rightarrow\; \frac{v_p}{v_a} = \frac{r_a}{r_p}.$$
For an ellipse, $r_p = a(1-e)$ and $r_a = a(1+e)$. With $e = 0.5$:
$$\frac{v_p}{v_a} = \frac{a(1+e)}{a(1-e)} = \frac{1+0.5}{1-0.5} = \frac{1.5}{0.5} = \boxed{3}.$$

**(ii) Kinetic energy ratio** (same mass, so $\propto v^2$):
$$\frac{K_p}{K_a} = \left(\frac{v_p}{v_a}\right)^2 = 3^2 = \boxed{9}.$$
The planet moves fastest (and has 9× the kinetic energy) at perihelion — a direct visualisation of Kepler's 2nd law.

---

### P8 — Rutherford differential cross-section

**Set-up.** A particle of mass $m$, energy $E = \tfrac12 m v_\infty^2$, approaches a fixed repulsive Coulomb centre $V(r) = k/r$ with $k = \dfrac{Zze^2}{4\pi\varepsilon_0} > 0$, along a hyperbolic orbit ($E>0\Rightarrow e>1$, from P3). The **impact parameter** $b$ is the perpendicular distance from the centre to the incoming asymptote; the **scattering angle** $\theta$ is the angle between incoming and outgoing asymptotes.

**Impact-parameter ↔ angle relation.** The hyperbola's asymptotes make the deflection satisfy (standard result of the orbit geometry, with $\cos\theta_\infty = -1/e$):
$$\boxed{\,b = \frac{k}{2E}\cot\frac{\theta}{2}\,}$$
*(Derivation sketch: from $r=p/(1+e\cos\theta)$ the asymptote direction is $\cos\theta_\infty = -1/e$; the scattering angle is $\theta = \pi - 2\theta_\infty$, giving $\cot(\theta/2)=\sqrt{e^2-1}$. With $\ell = m v_\infty b = b\sqrt{2mE}$ and $e^2 = 1 + (2E\ell^2/mk^2)$ this rearranges to the boxed line.)*

**Cross-section.** Particles entering the ring between $b$ and $b+db$ (area $2\pi b\,|db|$) emerge into the solid angle between $\theta$ and $\theta+d\theta$ ($d\Omega = 2\pi\sin\theta\,|d\theta|$). By definition
$$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta}\left|\frac{db}{d\theta}\right|.$$
Differentiate the boxed relation:
$$\frac{db}{d\theta} = \frac{k}{2E}\cdot\left(-\tfrac12\csc^2\tfrac{\theta}{2}\right) \;\Rightarrow\; \left|\frac{db}{d\theta}\right| = \frac{k}{4E}\csc^2\frac{\theta}{2}.$$
Use $\sin\theta = 2\sin\tfrac{\theta}{2}\cos\tfrac{\theta}{2}$ and $b = \frac{k}{2E}\cot\tfrac{\theta}{2} = \frac{k}{2E}\frac{\cos(\theta/2)}{\sin(\theta/2)}$:
$$\frac{d\sigma}{d\Omega} = \frac{1}{2\sin\frac\theta2\cos\frac\theta2}\cdot\frac{k}{2E}\frac{\cos\frac\theta2}{\sin\frac\theta2}\cdot\frac{k}{4E}\csc^2\frac\theta2 = \left(\frac{k}{2E}\right)^2\frac{1}{4}\,\frac{1}{\sin^4\frac\theta2}.$$
$$\boxed{\,\frac{d\sigma}{d\Omega} = \frac14\left(\frac{k}{2E}\right)^2\csc^4\frac{\theta}{2} = \left(\frac{Zze^2}{16\pi\varepsilon_0 E}\right)^2\csc^4\frac{\theta}{2}\,}$$

**Physics to state in the answer (for marks):** the $\csc^4(\theta/2)$ dependence means most particles barely deflect, but a tiny fraction scatter through large angles — the experimental signature of a small, dense, positively-charged nucleus (Geiger–Marsden, 1909–13). The total cross-section diverges because the Coulomb force has infinite range.

---
---

## Recurring-pattern insights (what UPSC keeps repeating here)

1. **"Derive the orbit, then classify by energy."** The chain *Binet equation → conic $r=p/(1+e\cos\theta)$ → $e=\sqrt{1+2E\ell^2/mk^2}$ → ellipse/parabola/hyperbola table* is the backbone of central-force questions and recurs in some form almost every year. Memorise it as one continuous derivation; examiners often ask only one link (e.g. "show the orbit is a conic" or "classify the orbits"), but knowing the whole chain lets you answer any of them.

2. **Effective potential + stability is a perennial "show that."** The pairing *"define $V_{\text{eff}}$"* and *"show stable circular orbits need $n<3$ for $F\propto-1/r^n$"* (or the equivalent "find the condition for a stable circular orbit") appears repeatedly. The inverse-cube spiral (P6) is the favourite trick variant — it's the borderline case of the same calculation, and it showed up in your own 15 Jun mock as the "exponential spiral" part.

3. **Rutherford bridges Paper I and Paper II.** The $\csc^4(\theta/2)$ cross-section is asked both as a *mechanics* problem (impact parameter, hyperbolic orbit) in Paper I and as *nuclear physics* (evidence for the nucleus, distance of closest approach) in Paper II. Learn the one derivation; it pays double. A very common numerical add-on is the **distance of closest approach** for a head-on collision, $r_{\min} = k/E = \frac{Zze^2}{4\pi\varepsilon_0 E}$ — keep it ready.

**Tip for next time:** Build a one-page "central-force flowchart" — start at the Lagrangian, branch to (a) conserved quantities, (b) Binet equation, (c) effective potential — and pin every boxed result above onto it. In the exam, central-force questions are won on *speed of recall* of these standard derivations, not cleverness; the candidate who can write the Binet→conic→energy chain from muscle memory banks 15 marks in 8 minutes. Next fortnight, when you move toward **rigid-body dynamics** (Euler's equations, symmetric top, moment-of-inertia tensor) or **small oscillations / normal modes**, I'll rotate the PYQ set there — both are the other heavily-repeated Paper I mechanics blocks not yet drilled.

---

*Generated for the weekly Physics Optional PYQ plan. All 8 problems are representative UPSC-style items built on standard, repeatedly-tested derivations — not verbatim past papers. Pull the actual Paper I PDFs from upsc.gov.in to practise exact wording and marking.*
