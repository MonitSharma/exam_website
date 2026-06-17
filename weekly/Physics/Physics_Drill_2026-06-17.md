# Physics Optional Drill — week of 17 June 2026

**Fortnight F2 (16–29 Jun): Lagrangian + Hamiltonian mechanics (Goldstein).**
Attempt everything first — all solutions are at the bottom. Target ~75–90 min.

> Conceptual hook for this fortnight: the Hamiltonian *H* equals the total energy *E* **only** when the coordinate transformation is time-independent (scleronomic) *and* the potential is velocity-independent. When the constraint is rheonomic (explicit time, e.g. a driven/rotating wire), *H* ≠ *E*. Examiners love this distinction.

---

## Problems

**P1 (warm-up).** A plane pendulum: point mass *m* on a rigid massless rod of length *l* swinging in a vertical plane.
(a) Write the Lagrangian using θ (measured from the downward vertical).
(b) Obtain the equation of motion.
(c) Find the period of small oscillations.

**P2 (Hamiltonian flavour — do this one carefully).** A bead of mass *m* slides without friction on a straight rigid wire that lies in a **horizontal** plane and rotates about a fixed vertical axis through one end with **constant** angular velocity ω. Let *r* be the distance of the bead from the axis.
(a) Write the Lagrangian with *r* as the generalized coordinate.
(b) Find the equation of motion and describe the bead's behaviour.
(c) Construct the Hamiltonian *H*. Show explicitly that *H* ≠ *E* (total energy). State which of the two is conserved and *why*.

**P3 (UPSC-level).** A particle of mass *m* moves in a plane under a central potential *V(r)*. Using plane polar coordinates (r, θ):
(a) Write the Lagrangian and the canonical momenta.
(b) Construct the Hamiltonian.
(c) Write Hamilton's equations, identify the cyclic coordinate and the conserved quantity, and reduce the problem to an effective 1-D radial problem.

---

## Derivation to reproduce from memory

**Derive Hamilton's canonical equations of motion from the Lagrangian via the Legendre transformation** (start from L(q, q̇, t), end at q̇ = ∂H/∂p, ṗ = −∂H/∂q, and the bonus relation ∂H/∂t = −∂L/∂t).

➡ Log this in your **Formula & Derivation Master Log** once you've reproduced it cleanly without looking. This is the single most-tested "show that" in the mechanics section.

---

## Past-year-style UPSC question

**⚠ Representative problem — NOT a verified verbatim PYQ.** I could not confirm exact wording/year from a reliable source in this run, so this is a representative UPSC-style question on the same syllabus area (spherical pendulum; cyclic coordinate + Hamiltonian). Treat the *type*, not the wording, as authentic. UPSC Physics Paper I reliably tests Lagrange's equations, cyclic coordinates, and the Hamiltonian.

> *Set up the Lagrangian for a spherical pendulum — a bob of mass m on a rigid massless rod of length l, free to swing in any direction. Identify the cyclic coordinate and the associated conserved momentum, and hence construct the Hamiltonian.* (≈15 marks)

---

## High-yield formulas to add to the log

- **Euler–Lagrange:**  d/dt(∂L/∂q̇ᵢ) − ∂L/∂qᵢ = 0
- **Legendre / Hamiltonian:**  pᵢ = ∂L/∂q̇ᵢ ,  H = Σ pᵢ q̇ᵢ − L
- **Hamilton's canonical equations:**  q̇ᵢ = ∂H/∂pᵢ ,  ṗᵢ = −∂H/∂qᵢ
- **Time-evolution / conservation:**  dH/dt = ∂H/∂t = −∂L/∂t  ⟹ if L has no explicit *t*, **H is conserved**.

---
---

# Solutions

### P1 — Plane pendulum

Position of bob: KE = ½ m l² θ̇²; PE (zero at pivot) = −mgl cos θ.

(a)  **L = ½ m l² θ̇² + mgl cos θ.**

(b)  ∂L/∂θ̇ = m l² θ̇ ⟹ d/dt(∂L/∂θ̇) = m l² θ̈;  ∂L/∂θ = −mgl sin θ.
Euler–Lagrange ⟹ m l² θ̈ + mgl sin θ = 0, i.e.
**θ̈ + (g/l) sin θ = 0.**

(c)  Small θ: sin θ ≈ θ ⟹ θ̈ + (g/l)θ = 0 ⟹ ω₀ = √(g/l), so
**T = 2π√(l/g).**

---

### P2 — Bead on a rotating wire (the *H* ≠ *E* showcase)

Constraint imposed by the rotation: φ = ωt (rheonomic). Cartesian position:
x = r cos ωt, y = r sin ωt ⟹ ẋ = ṙ cos ωt − rω sin ωt, ẏ = ṙ sin ωt + rω cos ωt.
Hence v² = ṙ² + r²ω². Horizontal plane ⟹ gravity does no work ⟹ V = 0.

(a)  **L = ½ m(ṙ² + r²ω²).**

(b)  ∂L/∂ṙ = m ṙ ⟹ m r̈;  ∂L/∂r = m r ω².
EOM: m r̈ − m r ω² = 0 ⟹ **r̈ = ω² r.**
General solution r(t) = A e^{ωt} + B e^{−ωt}: the bead is driven **outward** exponentially (centrifugal effect) unless launched exactly on the decaying mode.

(c)  Canonical momentum p_r = m ṙ ⟹ ṙ = p_r/m.
H = p_r ṙ − L = p_r²/m − ½ m(ṙ² + r²ω²) = p_r²/m − ½ p_r²/m − ½ m r²ω²:
**H = p_r²/(2m) − ½ m ω² r².**
Total energy (all kinetic here): **E = ½ m(ṙ² + r²ω²) = p_r²/(2m) + ½ m ω² r².**

The ½ m ω² r² term enters with **opposite sign** ⟹ **H ≠ E.**
- *H* is conserved: L has no explicit time dependence (∂L/∂t = 0 since ω is constant), so dH/dt = 0. *H* is the Jacobi energy function (kinetic energy in the rotating frame minus the centrifugal potential).
- *E* is **not** conserved: the wire (an external agent) must do work to keep ω constant as the bead moves out, continuously feeding energy to the bead.

This single example is the cleanest way to remember *why* the scleronomic/rheonomic condition matters.

---

### P3 — Central force: Lagrangian → Hamiltonian → reduction

(a)  In polar coordinates v² = ṙ² + r²θ̇²:
**L = ½ m(ṙ² + r²θ̇²) − V(r).**
Canonical momenta: p_r = ∂L/∂ṙ = m ṙ ;  p_θ = ∂L/∂θ̇ = m r² θ̇.
Invert: ṙ = p_r/m,  θ̇ = p_θ/(m r²).

(b)  H = p_r ṙ + p_θ θ̇ − L:
**H = p_r²/(2m) + p_θ²/(2m r²) + V(r).**

(c)  Hamilton's equations:
- ṙ = ∂H/∂p_r = p_r/m
- θ̇ = ∂H/∂p_θ = p_θ/(m r²)
- ṗ_r = −∂H/∂r = p_θ²/(m r³) − dV/dr
- ṗ_θ = −∂H/∂θ = 0 ⟹ **θ is cyclic, p_θ = l = const (angular momentum).**

Substituting p_θ = l defines the **effective potential**
V_eff(r) = V(r) + l²/(2m r²),
and the radial motion reduces to the 1-D equation **m r̈ = −dV_eff/dr.** The centrifugal term l²/(2m r²) is what the cyclic coordinate "leaves behind."

---

### Derivation — Hamilton's equations via the Legendre transform

Start from L(q, q̇, t). Define pᵢ ≡ ∂L/∂q̇ᵢ and H ≡ Σ pᵢ q̇ᵢ − L.

Take the total differential of H, treating it first "from the definition":
dH = Σ(q̇ᵢ dpᵢ + pᵢ dq̇ᵢ) − Σ(∂L/∂qᵢ dqᵢ + ∂L/∂q̇ᵢ dq̇ᵢ) − ∂L/∂t dt.

Because pᵢ = ∂L/∂q̇ᵢ, the terms pᵢ dq̇ᵢ and (∂L/∂q̇ᵢ) dq̇ᵢ **cancel** — this is the whole point of the Legendre transform (H is naturally a function of p, not q̇):
dH = Σ q̇ᵢ dpᵢ − Σ (∂L/∂qᵢ) dqᵢ − ∂L/∂t dt.

Now use Lagrange's equation ∂L/∂qᵢ = d/dt(∂L/∂q̇ᵢ) = ṗᵢ:
dH = Σ q̇ᵢ dpᵢ − Σ ṗᵢ dqᵢ − ∂L/∂t dt.

But H = H(q, p, t), so also dH = Σ(∂H/∂qᵢ) dqᵢ + Σ(∂H/∂pᵢ) dpᵢ + (∂H/∂t) dt.

Matching coefficients of the independent differentials dqᵢ, dpᵢ, dt gives the **canonical equations**:
**q̇ᵢ = ∂H/∂pᵢ,  ṗᵢ = −∂H/∂qᵢ,  ∂H/∂t = −∂L/∂t.**

The last relation immediately shows that if L (and hence H) carries no explicit time dependence, H is a constant of the motion.

---

### Representative PYQ — spherical pendulum (solution sketch)

Coordinates: θ = angle from the downward vertical, φ = azimuth; rod length l.
Speed²: v² = l²θ̇² + l² sin²θ φ̇²; height below pivot gives V = −mgl cos θ.

**L = ½ m l²(θ̇² + sin²θ φ̇²) + mgl cos θ.**

φ does not appear in L ⟹ **φ is cyclic** ⟹ its conjugate momentum is conserved:
**p_φ = ∂L/∂φ̇ = m l² sin²θ φ̇ = const** (angular momentum about the vertical axis).
Also p_θ = m l² θ̇.

Invert (θ̇ = p_θ/ml², φ̇ = p_φ/(ml² sin²θ)) and form H = Σ p q̇ − L:
**H = p_θ²/(2ml²) + p_φ²/(2ml² sin²θ) − mgl cos θ.**

H has no explicit time dependence ⟹ H (= total energy here, since the transformation is scleronomic and V is velocity-independent) is conserved; together with the conserved p_φ the system is integrable and reduces to 1-D motion in θ with effective potential p_φ²/(2ml² sin²θ) − mgl cos θ.

---

*Logging reminder: add the four formulas above and the Legendre-transform derivation to your Formula & Derivation Master Log this week. Next fortnight (F3, 30 Jun) shifts to oscillations + central force — the V_eff machinery from P3 carries straight over.*
