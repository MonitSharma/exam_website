# Physics Optional PYQ Plan — week of 2026-07-07

**Paper I · Electrodynamics · Topic: Boundary-Value Problems, Multipole Expansion & EM Waves in Media**

> **Why this topic now:** The last two weeks (2026-06-23, 2026-06-30) covered Mechanics — central force motion and rigid-body dynamics — closing out the F2 Mechanics fortnight. This week rotates into **Electrodynamics** (Paper I), the next block in the Mechanics → EM → Optics → Thermo cycle. Electrodynamics is UPSC's second-most-repeated Paper I section: some form of {method-of-images / Laplace boundary-value problem, multipole expansion, EM-wave boundary conditions, Poynting vector / energy flow, dipole radiation} appears almost every year. These 8 problems cover all five recurring flavors.

**Not yet covered / still to rotate through:** Optics, Thermo & Statistical Mechanics (Paper I); Quantum Mechanics, Atomic & Molecular, Nuclear & Particle, Solid State, Electronics, Special Relativity (Paper II) — these will come up in upcoming fortnights.

---

## How to use this set (timed)

1. **Attempt first, closed-book, ~90 minutes.** Treat P1–P3 as 15-markers, P4–P6 as 15–20 markers, P7–P8 as 15-markers. Draw diagrams — UPSC gives marks for correctly labelled geometry.
2. **Then** check against the worked solutions below.
3. Log every boxed result into your **Formula & Derivation Master Log** under *"Electrodynamics."*
4. **Source the real papers yourself:** go to the UPSC official site (`upsc.gov.in` → Examination → Previous Year Question Papers) and pull the **Physics Paper I** PDFs for the last ~20 years (2005–2025 range covers CSE, plus older ones if available in standard compilations like Made Easy / IFoS-adjacent sets). Search each PDF for "image charge", "grounded sphere", "multipole", "dielectric sphere", "Fresnel", "skin depth", "Poynting", "Larmor". I'm not reproducing full copyrighted papers here — the problems below are representative, built from the recurring UPSC pattern, not verbatim transcriptions unless noted.

---

## Problems (representative UPSC-style, closed-book attempt first)

**P1.** A point charge *q* is held at height *d* above an infinite grounded conducting plane.
(a) Find the potential everywhere above the plane using the method of images.
(b) Find the induced surface charge density on the plane.
(c) Find the force on the charge and the total induced charge.

**P2.** A point charge *q* is placed at distance *s* from the center of a grounded conducting sphere of radius *a* (*s > a*).
(a) Find the image charge *q′* and its location that reproduces the boundary condition V = 0 on the sphere.
(b) Find the force between the charge and the sphere.

**P3.** A "physical dipole" consists of charge +*q* at *z = d*/2 and −*q* at *z* = −*d*/2.
(a) Compute the monopole, dipole, and quadrupole moments of this distribution.
(b) Write the leading-order potential at large *r* and identify which multipole term dominates.

**P4.** A dielectric sphere of radius *a* and permittivity *ε* is placed in a uniform external field **E**₀ = E₀ẑ (in vacuum, permittivity ε₀).
(a) Solve Laplace's equation inside and outside the sphere using the general axisymmetric solution.
(b) Apply the boundary conditions at *r = a* and find the field inside the sphere.

**P5.** A plane EM wave in a non-magnetic medium of refractive index *n*₁ is normally incident on a plane interface with a second non-magnetic medium of refractive index *n*₂.
(a) Using continuity of tangential **E** and **H**, derive the amplitude reflection and transmission coefficients.
(b) Find the reflectance *R* and transmittance *T*, and verify *R + T =* 1.

**P6.** Starting from Maxwell's equations in a good conductor (conductivity σ, σ ≫ ωε), derive the skin depth δ for a plane wave of angular frequency ω.

**P7.** A parallel-plate capacitor (circular plates, radius *a*, separation *d*) is being charged by a slowly varying current *I(t)*. Using the Poynting vector, show that the electromagnetic energy flows in through the sides of the capacitor (not along the connecting wires), and verify that the power flowing in equals *VI*.

**P8. (20-marker)** Derive the Larmor formula for the total power radiated by a non-relativistic accelerated point charge, and apply it to find the time-averaged power radiated by an oscillating electric dipole *p(t) = p*₀cos(ω*t*).

---

## Worked Solutions

### P1 — Point charge above a grounded plane

Place *q* at (0, 0, *d*). The image charge is −*q* at (0, 0, −*d*). For *z* > 0, this image reproduces V = 0 at *z* = 0 (by symmetry, every point on the plane is equidistant from both charges, so the potentials cancel).

**(a) Potential (z > 0):**

$$V(x,y,z)=\frac{1}{4\pi\varepsilon_0}\left[\frac{q}{\sqrt{x^2+y^2+(z-d)^2}}-\frac{q}{\sqrt{x^2+y^2+(z+d)^2}}\right]$$

**(b) Induced surface charge:** σ = −ε₀ ∂V/∂z at z = 0. Differentiating and evaluating:

$$\sigma(x,y) = -\frac{qd}{2\pi\left(x^2+y^2+d^2\right)^{3/2}}$$

Integrating σ over the whole plane gives total induced charge = −*q* (as required — all field lines from *q* end on the plane).

**(c) Force:** The plane exerts the same force on *q* as the image charge would — pure Coulomb attraction at separation 2*d*:

$$F=-\frac{1}{4\pi\varepsilon_0}\frac{q^2}{(2d)^2}\ \hat z=-\frac{q^2}{16\pi\varepsilon_0 d^2}\hat z \quad \text{(attractive, toward the plane)}$$

---

### P2 — Point charge and a grounded conducting sphere

For a grounded sphere of radius *a*, the image charge that makes V = 0 on the sphere's surface (*r = a*) is:

$$q' = -\frac{a}{s}q \quad \text{located at } s' = \frac{a^2}{s} \text{ from the center, on the line joining center and } q$$

**Verification:** for any point **r** on the sphere, the ratio of distances to *q* and *q′*'s positions is fixed at *a/s*, which is exactly what's needed for the two potential terms to cancel — this is the standard "inverse point" construction.

**(b) Force:** since the field outside the sphere is exactly reproduced by the image charge, the force on *q* equals the Coulomb force between *q* and *q′* at separation (*s − s′*):

$$s - s' = s - \frac{a^2}{s} = \frac{s^2-a^2}{s}$$

$$F = \frac{1}{4\pi\varepsilon_0}\frac{q\,q'}{(s-s')^2} = -\frac{1}{4\pi\varepsilon_0}\frac{q^2 a s}{(s^2-a^2)^2}\quad\text{(attractive)}$$

---

### P3 — Multipole moments of a physical dipole

Charges: +*q* at *z* = *d*/2, −*q* at *z* = −*d*/2.

**Monopole:** *Q* = *q* + (−*q*) = 0.

**Dipole moment:** $\mathbf p=\sum_i q_i\mathbf r_i = q\left(\frac d2\right)\hat z+(-q)\left(-\frac d2\right)\hat z = qd\,\hat z$

**Quadrupole:** using $Q_{ij}=\sum_a q_a(3x_ix_j-r^2\delta_{ij})$, the only nonzero diagonal candidate is *Q_zz*. For the charge at *z* = *d*/2 (*r* = *d*/2): contribution = *q*(3(*d*/2)² − (*d*/2)²) = *q*·2·(*d*/2)² = *qd*²/2. For −*q* at *z* = −*d*/2: contribution = −*q*·2·(*d*/2)² = −*qd*²/2. **Sum = 0.**

**(b)** So this symmetric physical dipole has *zero* monopole *and* zero quadrupole moment — the potential is *pure dipole* to leading (and indeed to all even) order:

$$V(r,\theta)\approx\frac{1}{4\pi\varepsilon_0}\frac{qd\cos\theta}{r^2}$$

**Recurring exam point:** always check symmetry before grinding through the quadrupole integral — a large fraction of "find the multipole moments" problems are designed so most terms vanish by parity.

---

### P4 — Dielectric sphere in a uniform field

General axisymmetric solution of Laplace's equation: $V(r,\theta)=\sum_l\left(A_lr^l+\frac{B_l}{r^{l+1}}\right)P_l(\cos\theta)$. Only *l* = 1 survives (uniform field forces this).

**Inside** (finite at *r* = 0): $V_{in}=-Ar\cos\theta$
**Outside** (→ uniform field at infinity): $V_{out}=-E_0r\cos\theta+\dfrac{B\cos\theta}{r^2}$

**Boundary conditions at r = a** (continuity of V, and continuity of *D_r* since there's no free surface charge):

Continuity of V: $-E_0a+\dfrac{B}{a^2}=-Aa \;\Rightarrow\; A = E_0-\dfrac{B}{a^3}$

Continuity of *D_r* = −ε∂V/∂r: $\varepsilon_0\left(E_0+\dfrac{2B}{a^3}\right)=\varepsilon A$

Substituting and solving:

$$B=a^3E_0\frac{\varepsilon-\varepsilon_0}{\varepsilon+2\varepsilon_0},\qquad A = \frac{3\varepsilon_0}{\varepsilon+2\varepsilon_0}E_0$$

**Field inside the sphere** is uniform:

$$\boxed{\mathbf E_{in}=\frac{3\varepsilon_0}{\varepsilon+2\varepsilon_0}\,\mathbf E_0}$$

— always *reduced* relative to the applied field (since ε > ε₀), the classic depolarization result.

---

### P5 — Normal-incidence reflection/transmission

Write incident, reflected (medium 1) and transmitted (medium 2) plane waves with **E** ⊥ **B**, propagating along *z*. Using B = *n*E/*c* for each wave and continuity of tangential **E** and **H** = **B**/μ₀ at *z* = 0 (μ₁ = μ₂ = μ₀):

Continuity of E: $E_0^{(i)}+E_0^{(r)}=E_0^{(t)}$
Continuity of H: $n_1\left(E_0^{(i)}-E_0^{(r)}\right)=n_2E_0^{(t)}$

Solving these two equations for the amplitude ratios:

$$r\equiv\frac{E_0^{(r)}}{E_0^{(i)}}=\frac{n_1-n_2}{n_1+n_2},\qquad t\equiv\frac{E_0^{(t)}}{E_0^{(i)}}=\frac{2n_1}{n_1+n_2}$$

**(b)** Reflectance and transmittance (energy ratios, using Poynting flux ∝ *n*E²):

$$R=r^2=\left(\frac{n_1-n_2}{n_1+n_2}\right)^2,\qquad T=\frac{n_2}{n_1}t^2=\frac{4n_1n_2}{(n_1+n_2)^2}$$

Check: $R+T=\dfrac{(n_1-n_2)^2+4n_1n_2}{(n_1+n_2)^2}=\dfrac{(n_1+n_2)^2}{(n_1+n_2)^2}=1$ ✓ (energy conserved).

---

### P6 — Skin depth in a good conductor

Maxwell's equations in a conductor give a modified wave equation for **E** with an extra term from Ohm's law **J** = σ**E**:

$$\nabla^2\mathbf E=\mu\sigma\frac{\partial\mathbf E}{\partial t}+\mu\varepsilon\frac{\partial^2\mathbf E}{\partial t^2}$$

For a plane wave $\mathbf E=E_0e^{i(kz-\omega t)}\hat x$, this gives the dispersion relation

$$k^2=\mu\varepsilon\omega^2+i\mu\sigma\omega$$

**Good conductor limit** (σ ≫ ωε): the first term is negligible, so $k^2\approx i\mu\sigma\omega$, giving

$$k\approx(1+i)\sqrt{\frac{\mu\sigma\omega}{2}}$$

The wave amplitude decays as $e^{-\mathrm{Im}(k)\,z}$, defining the skin depth δ = 1/Im(*k*):

$$\boxed{\delta=\sqrt{\frac{2}{\mu\sigma\omega}}}$$

---

### P7 — Poynting vector in a charging capacitor

Between the plates, the displacement current $\varepsilon_0\partial E/\partial t$ produces an azimuthal **B** (Ampère–Maxwell law, cylindrical symmetry, radius *s* from axis):

$$B(s)\cdot 2\pi s=\mu_0\varepsilon_0\frac{\partial E}{\partial t}\,\pi s^2 \;\Rightarrow\; B(s)=\frac{\mu_0\varepsilon_0 s}{2}\frac{dE}{dt}$$

Since *I* = *dQ/dt* = ε₀(π*a*²) *dE/dt*, we get *dE/dt* = *I*/(ε₀π*a*²), so at the edge (*s* = *a*):

$$B(a)=\frac{\mu_0 I}{2\pi a}$$

— matching the field of a straight wire just outside the capacitor, a nice consistency check.

**Poynting vector** at *s = a* points radially **inward** (E is axial, B is azimuthal, **E**×**H** points toward the axis):

$$S = \frac{E\,B(a)}{\mu_0}=\frac{EI}{2\pi a}$$

**Power flowing in** through the cylindrical side surface (area 2π*a d*):

$$P_{in}=S\cdot(2\pi a d)=E\,I\,d = \left(\frac Vd\right)Id=VI$$

This equals the electrical power *VI* delivered to the capacitor — confirming energy flows in through the **sides** of the gap, not along the wires, even though a naive circuit picture suggests the latter.

---

### P8 — Larmor formula and dipole radiation

For a non-relativistic point charge *q* with acceleration *a*, the far (radiation) field is

$$E_{rad}=\frac{\mu_0 q a\sin\theta}{4\pi r},\qquad B_{rad}=\frac{E_{rad}}{c}$$

Poynting flux: $S=\dfrac{E_{rad}^2}{\mu_0 c}=\dfrac{\mu_0 q^2a^2\sin^2\theta}{16\pi^2 r^2c}$. Integrating over a sphere of radius *r* (using $\int\sin^3\theta\,d\theta\,d\phi = \frac{8\pi}{3}$):

$$P=\oint S\,r^2\,d\Omega=\frac{\mu_0q^2a^2}{16\pi^2c}\cdot\frac{8\pi}{3}$$

$$\boxed{P=\frac{\mu_0 q^2a^2}{6\pi c}}\quad\text{(Larmor's formula)}$$

**Applied to an oscillating dipole** *p(t)* = *p*₀cos(ω*t*): treat as charge *q* oscillating with $z(t)=z_0\cos\omega t$ so $p_0=qz_0$; acceleration $a(t)=-\omega^2z_0\cos\omega t$. Time-averaging *a*² = ω⁴*z*₀²/2, and substituting *qz*₀ = *p*₀:

$$\langle P\rangle=\frac{\mu_0 p_0^2\omega^4}{12\pi c}$$

This ω⁴ dependence is why blue light scatters more than red (Rayleigh scattering) and is a recurring bridge topic between Paper I (radiation) and Paper II (atomic transitions, spontaneous emission).

---

## Key Formulas Used

- Method of images (plane): image charge −*q* at mirror point; σ = −*qd*/[2π(ρ²+*d*²)^(3/2)]
- Method of images (sphere): *q′* = −(*a*/*s*)*q* at *s′* = *a*²/*s*
- Multipole expansion: $V(r)=\dfrac{1}{4\pi\varepsilon_0}\sum_l \dfrac{1}{r^{l+1}}\int \rho(\mathbf r')r'^lP_l(\cos\gamma)\,d\tau'$; dipole moment **p** = Σqᵢrᵢ; quadrupole tensor *Q_ij* = Σq(3xᵢxⱼ − r²δᵢⱼ)
- Laplace's equation, axisymmetric: $V(r,\theta)=\sum_l(A_lr^l+B_lr^{-(l+1)})P_l(\cos\theta)$
- Dielectric sphere in uniform field: **E**_in = [3ε₀/(ε+2ε₀)]**E**₀
- Fresnel (normal incidence, non-magnetic): *r* = (*n*₁−*n*₂)/(*n*₁+*n*₂); *R* = *r*²; *R*+*T* = 1
- Skin depth: δ = √(2/μσω)
- Poynting vector: **S** = **E**×**H**
- Larmor formula: *P* = μ₀*q*²*a*²/(6π*c*); oscillating dipole: ⟨*P*⟩ = μ₀*p*₀²ω⁴/(12π*c*)

---

## Recurring-Pattern Insights

1. **Boundary-value problems are a template, not a puzzle.** Whether it's a grounded plane, a grounded sphere, or a dielectric sphere in a field, the recipe is identical: write the general Laplace solution appropriate to the symmetry (Legendre series for spheres), then apply exactly two boundary conditions (V continuous, D_normal jump = free surface charge, or = 0 if none). UPSC recycles this skeleton across at least 15 different "flavors" of geometry — learn the skeleton once, not each variant.

2. **Multipole problems are symmetry-detection problems.** Most "find the moments" questions are constructed so the monopole and often the quadrupole vanish by parity/symmetry (as in P3). Before computing any integral, ask which moments *must* vanish — this saves 80% of the algebra and is exactly the kind of insight examiners reward with "elegant solution" marks.

3. **EM-wave boundary-condition problems (P5, P6) share one method:** write plane-wave trial solutions on both sides of an interface, then force continuity of the two tangential field components. Everything else — Fresnel coefficients, skin depth, waveguide cutoff conditions — falls out of this same two-equation system with different inputs.

## One Tip

Build a **"boundary-condition recipe card"**: for any EM problem (electrostatic BVP or wave interface), always execute the same four steps — (i) identify the media/regions, (ii) write the general solution valid in each region, (iii) apply exactly the two relevant boundary conditions, (iv) solve the resulting 2×2 linear system. This turns every "novel-looking" Electrodynamics question into a template execution rather than a from-scratch derivation, which is the single biggest speed gain available in this section.
