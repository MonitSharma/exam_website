# Physics Optional Drill — week of 2026-06-10

**Fortnight F1 (2–15 Jun 2026) · Topic: Lagrangian Mechanics (Goldstein Ch. 1)**
Attempt everything first. All solutions are at the **end**.

---

## Problems (attempt these)

**P1 (warm-up).** A simple pendulum: bob of mass $m$ on a massless rod of length $l$ swinging in a vertical plane, angle $\theta$ from the downward vertical. Write the Lagrangian and obtain the equation of motion. State the small-oscillation frequency.

**P2 (medium).** An Atwood machine: masses $m_1$ and $m_2$ hang over a massless, frictionless pulley on an inextensible string. Using a single generalized coordinate, find the acceleration of $m_1$.

**P3 (UPSC-level).** A bead of mass $m$ slides on a frictionless circular wire of radius $a$. The wire rotates with **constant** angular velocity $\omega$ about its vertical diameter. Let $\theta$ be the angle of the bead measured from the downward vertical.
(a) Write the Lagrangian. (b) Derive the equation of motion. (c) Find all equilibrium positions and the condition under which an equilibrium *off* the axis exists.

---

## Derivation to reproduce from memory

**Derive Lagrange's equations of motion from D'Alembert's principle** (the Goldstein Ch. 1 route), for a system of holonomic constraints with conservative forces. End at:
$$\frac{d}{dt}\!\left(\frac{\partial L}{\partial \dot q_j}\right) - \frac{\partial L}{\partial q_j} = 0 .$$
➡️ **Log this in your Formula & Derivation Master Log** (Ch.1 — "Lagrange from D'Alembert").

---

## Past-year UPSC question (representative)

> *"Write down Lagrange's equations of motion for a system of particles acted on by conservative forces. Define a cyclic (ignorable) coordinate and show that the generalized momentum conjugate to a cyclic coordinate is conserved."*

**Status: representative UPSC-style question, closely matching a Physics Paper I item from ~2003** (cyclic-coordinate / conserved generalized momentum). Treat the exact wording as approximate — the *physics asked* is authentic and high-frequency. (A related 2001 paper gave a two-coordinate Lagrangian and asked for the EOM.) Solution sketch below.

---

## High-yield formulas (add to log)

1. **Lagrange's equation (conservative):** $\dfrac{d}{dt}\dfrac{\partial L}{\partial \dot q_j} - \dfrac{\partial L}{\partial q_j} = 0$, with $L = T - V$.
   General (with non-potential generalized forces $Q_j$): $\dfrac{d}{dt}\dfrac{\partial L}{\partial \dot q_j} - \dfrac{\partial L}{\partial q_j} = Q_j$.
2. **Generalized (conjugate) momentum:** $p_j \equiv \dfrac{\partial L}{\partial \dot q_j}$. If $q_j$ is **cyclic** ($\partial L/\partial q_j = 0$), then $p_j = \text{const}$.

---
---

## Solutions

### P1 — Simple pendulum
Generalized coordinate $\theta$. Bob speed $= l\dot\theta$, height (from pivot) $= -l\cos\theta$.
$$T = \tfrac12 m l^2 \dot\theta^2,\qquad V = -mgl\cos\theta.$$
$$L = \tfrac12 m l^2\dot\theta^2 + mgl\cos\theta.$$
$$\frac{\partial L}{\partial\dot\theta}=ml^2\dot\theta \Rightarrow \frac{d}{dt}=ml^2\ddot\theta,\qquad \frac{\partial L}{\partial\theta}=-mgl\sin\theta.$$
Lagrange's equation gives
$$ml^2\ddot\theta + mgl\sin\theta = 0 \;\Rightarrow\; \boxed{\ddot\theta + \tfrac{g}{l}\sin\theta = 0.}$$
Small angles ($\sin\theta\approx\theta$): $\ddot\theta + (g/l)\theta=0$, so $\boxed{\omega=\sqrt{g/l}}$.

### P2 — Atwood machine
Let $x$ be the distance of $m_1$ below the pulley; with string length $\ell$ fixed, $m_2$ is at $\ell-x$, and both speeds equal $\dot x$.
$$T=\tfrac12(m_1+m_2)\dot x^2,\qquad V=-m_1 g x - m_2 g(\ell-x).$$
$$L=\tfrac12(m_1+m_2)\dot x^2 + (m_1-m_2)gx + \text{const}.$$
$$\frac{d}{dt}\frac{\partial L}{\partial\dot x}=(m_1+m_2)\ddot x,\qquad \frac{\partial L}{\partial x}=(m_1-m_2)g.$$
$$\Rightarrow (m_1+m_2)\ddot x-(m_1-m_2)g=0 \;\Rightarrow\; \boxed{\ddot x=\frac{(m_1-m_2)}{(m_1+m_2)}\,g.}$$

### P3 — Bead on a rotating circular wire
The wire rotates about the vertical diameter at constant $\omega$, so azimuth $\phi=\omega t$ ($\dot\phi=\omega$). The bead sits on a sphere of radius $a$; its distance from the rotation axis is $a\sin\theta$.

**(a)** Velocity components: meridional $a\dot\theta$, azimuthal $a\sin\theta\,\omega$.
$$T=\tfrac12 m\left(a^2\dot\theta^2 + a^2\omega^2\sin^2\theta\right),\qquad V=-mga\cos\theta.$$
$$\boxed{L=\tfrac12 m a^2\dot\theta^2 + \tfrac12 m a^2\omega^2\sin^2\theta + mga\cos\theta.}$$

**(b)**
$$\frac{\partial L}{\partial\dot\theta}=ma^2\dot\theta \Rightarrow \frac{d}{dt}=ma^2\ddot\theta,$$
$$\frac{\partial L}{\partial\theta}=ma^2\omega^2\sin\theta\cos\theta - mga\sin\theta.$$
$$ma^2\ddot\theta - ma^2\omega^2\sin\theta\cos\theta + mga\sin\theta=0$$
$$\Rightarrow \boxed{\ddot\theta = \left(\omega^2\cos\theta - \frac{g}{a}\right)\sin\theta.}$$

**(c)** Equilibria require $\ddot\theta=0$:
- $\sin\theta=0 \Rightarrow \theta=0$ (bottom) and $\theta=\pi$ (top).
- $\cos\theta=\dfrac{g}{a\omega^2}$, which has a solution **only if** $\boxed{\omega^2 \ge g/a}$.

So below the critical speed $\omega_c=\sqrt{g/a}$ the only stable equilibrium is $\theta=0$. Once $\omega>\omega_c$, the bottom becomes unstable and a new **stable off-axis equilibrium** appears at $\theta_0=\cos^{-1}\!\big(g/(a\omega^2)\big)$ — the classic centrifugal "pitchfork" bifurcation.

### Derivation — Lagrange's equations from D'Alembert's principle (outline)
1. **D'Alembert's principle:** for applied forces $\mathbf F_i$ and inertial reactions, virtual work of constraint forces vanishes, so
$$\sum_i\left(\mathbf F_i - \dot{\mathbf p}_i\right)\cdot\delta\mathbf r_i = 0.$$
2. Introduce generalized coords: $\mathbf r_i=\mathbf r_i(q_1,\dots,q_n,t)$, so $\delta\mathbf r_i=\sum_j\dfrac{\partial\mathbf r_i}{\partial q_j}\delta q_j$.
3. The applied-force term becomes $\sum_j Q_j\,\delta q_j$ with $Q_j=\sum_i\mathbf F_i\cdot\dfrac{\partial\mathbf r_i}{\partial q_j}$.
4. The inertial term, using the two "cancellation of dots" identities $\dfrac{\partial\mathbf r_i}{\partial q_j}=\dfrac{\partial\dot{\mathbf r}_i}{\partial\dot q_j}$ and $\dfrac{d}{dt}\dfrac{\partial\mathbf r_i}{\partial q_j}=\dfrac{\partial\dot{\mathbf r}_i}{\partial q_j}$, reduces to
$$\sum_i\dot{\mathbf p}_i\cdot\frac{\partial\mathbf r_i}{\partial q_j}=\frac{d}{dt}\frac{\partial T}{\partial\dot q_j}-\frac{\partial T}{\partial q_j}.$$
5. Since the $\delta q_j$ are independent (holonomic constraints), each coefficient vanishes:
$$\frac{d}{dt}\frac{\partial T}{\partial\dot q_j}-\frac{\partial T}{\partial q_j}=Q_j.$$
6. For conservative forces $Q_j=-\partial V/\partial q_j$ with $V=V(q)$; defining $L=T-V$ gives
$$\boxed{\frac{d}{dt}\frac{\partial L}{\partial\dot q_j}-\frac{\partial L}{\partial q_j}=0.}$$

### PYQ — solution sketch
**Lagrange's equations:** $\dfrac{d}{dt}\dfrac{\partial L}{\partial\dot q_j}-\dfrac{\partial L}{\partial q_j}=0$, $L=T-V$ (as derived above).

**Cyclic (ignorable) coordinate:** a coordinate $q_k$ that does **not** appear explicitly in $L$, i.e. $\partial L/\partial q_k=0$ (though $\dot q_k$ may appear).

**Conservation:** the conjugate momentum is $p_k=\partial L/\partial\dot q_k$. Lagrange's equation for $q_k$ reads
$$\frac{d}{dt}\frac{\partial L}{\partial\dot q_k}=\frac{\partial L}{\partial q_k}=0 \;\Rightarrow\; \frac{dp_k}{dt}=0 \;\Rightarrow\; p_k=\text{const.}$$
Hence the generalized momentum conjugate to a cyclic coordinate is conserved. (Examples: ignoring $\phi$ in a central-force problem conserves angular momentum; ignoring $x$ conserves linear momentum.)

---
*Next fortnight (F2, 16–29 Jun): Lagrangian + Hamiltonian (Goldstein) — expect Legendre transform, Hamilton's equations, and Poisson brackets.*

**Sources (PYQ verification):** [Physics Paper 1 CSE Questions (Scribd)](https://www.scribd.com/document/420012777/Physics-Paper-1-CSE-Questions-Upscpdf-com) · [100 Questions on Physics Optional — The Education Market](https://theeducationmarket.com/questions-on-physics-optional-for-upsc/)
