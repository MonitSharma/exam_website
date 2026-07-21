# Physics Optional PYQ Plan — week of 2026-07-21

**Paper I · Optics (Part 2) · Topic: Lasers, Fibre Optics, Holography & Optical Activity**

> **Why this topic now:** Last week (`2026-07-14`) opened the **F4 Optics fortnight (14–27 Jul)** with the wave-optics half — interference, diffraction, polarization, coherence. This week closes the block with the **modern-optics half** that UPSC lists explicitly in the Paper I syllabus and asks *almost every year*: Einstein coefficients and laser action, optical fibres (NA / V-number / dispersion), holography, and optical rotation. These are also the highest **marks-per-hour** questions in Paper I — short, formulaic, and repeated with only the numbers changed.

**Rotation tracker — already drilled:** Mechanics (Lagrangian/Hamiltonian ✅, central force ✅, rigid body ✅) · Electrodynamics (images, multipole, EM waves in media, Poynting, radiation ✅) · Optics Part 1 (interference, diffraction, polarization, coherence ✅) · **Optics Part 2 (this week)**.
**Next up (F5, 28 Jul – 10 Aug):** Thermodynamics & Statistical Mechanics — the last untouched Paper I block. **Then Paper II:** Quantum Mechanics · Atomic & Molecular · Nuclear & Particle · Solid State · Electronics · Special Relativity.

---

## How to use this set (timed)

1. **Attempt closed-book, ~90 minutes.** Treat P1 and P6 as 20-markers, P2/P4/P5/P8 as 15-markers, P3 and P7 as 10-mark numericals.
2. **Draw the figure every time** — energy-level diagram (P1–P3), ray path in the fibre core (P4), the recording/reconstruction geometry (P6), the LCP+RCP vector diagram (P8). In this section UPSC gives a large share of marks for the labelled diagram alone.
3. **Then** check against the worked solutions below, and log every boxed result into your **Formula & Derivation Master Log** under *"Optics — Lasers & Fibres."*
4. **Source the real papers yourself:** UPSC official site (`upsc.gov.in` → *Examination → Previous Year Question Papers*) → download the **Physics Paper I** PDFs across the last ~20 years. Search each for `"Einstein coefficients"`, `"population inversion"`, `"He-Ne"`, `"ruby laser"`, `"numerical aperture"`, `"acceptance angle"`, `"step index"`, `"holography"`, `"specific rotation"`, `"optical activity"`. Texts that mirror UPSC phrasing: **Ghatak, *Optics*** (Ch. on lasers & fibres — the closest match to UPSC's wording), **Ghatak & Thyagarajan, *Introduction to Fiber Optics***, **Svelto, *Principles of Lasers***, **Brijlal & Subrahmanyam** for optical rotation and the classic numericals.

> ⚠️ **Honesty note:** The 8 problems below are **representative UPSC-style** items built on the exact derivations and numericals UPSC repeats. They are **not** claimed to be verbatim past questions — treat the specific wording as mine, not UPSC's. Pull the actual Paper I PDFs from `upsc.gov.in` for exact phrasing and mark allocation. Never present these as the real paper.

---

## Problems (representative UPSC-style — closed-book attempt first)

**P1 (the perennial 20-marker).** Consider a two-level atomic system in thermal equilibrium with blackbody radiation of energy density $\rho(\nu)$ at temperature $T$.
(a) Write the rate equations for absorption, spontaneous emission and stimulated emission, defining the **Einstein coefficients** $B_{12}$, $A_{21}$, $B_{21}$.
(b) Using the Boltzmann distribution and requiring consistency with the **Planck radiation law**, derive the two Einstein relations $B_{12} = B_{21}$ and $A_{21}/B_{21} = 8\pi h\nu^3/c^3$.
(c) Hence show that the ratio of spontaneous to stimulated emission rates is $R = e^{h\nu/k_BT} - 1$, and comment on what this implies for building a *microwave* maser versus an *optical* laser.

**P2.** For a laser oscillator consisting of an active medium of length $L$ and small-signal gain coefficient $g$ per unit length, placed in a cavity with mirror reflectances $R_1, R_2$ and distributed loss $\alpha$ per unit length:
(a) Derive the **threshold condition for laser oscillation**, $g_{\text{th}} = \alpha + \dfrac{1}{2L}\ln\!\dfrac{1}{R_1R_2}$.
(b) Explain the roles of **metastable states** and **population inversion**.
(c) Compare **three-level** (ruby) and **four-level** (Nd:YAG, He–Ne) schemes and explain why the four-level scheme has a far lower pumping threshold.

**P3 (numerical + description).**
(a) Describe the construction and working of the **He–Ne laser**, with an energy-level diagram, explaining the role of helium and the resonant energy transfer to neon.
(b) For the $632.8\ \text{nm}$ He–Ne line, compute the ratio of **spontaneous to stimulated** emission rates at $T = 300\ \text{K}$ in thermal equilibrium, and state the physical conclusion.
*(Take $h = 6.626\times10^{-34}\ \text{J s}$, $k_B = 1.38\times10^{-23}\ \text{J K}^{-1}$, $c = 3\times10^{8}\ \text{m s}^{-1}$.)*

**P4 (fibre — the most-repeated numerical).** For a **step-index optical fibre** with core index $n_1$, cladding index $n_2$ ($n_1 > n_2$), core radius $a$, launched from a medium of index $n_0$:
(a) Derive the **acceptance angle** and show that the **numerical aperture** is $\text{NA} = \sqrt{n_1^2 - n_2^2}$.
(b) Define the **normalized frequency (V-number)** and state the single-mode condition.
(c) A fibre has $n_1 = 1.48$, $n_2 = 1.46$, $a = 25\ \mu\text{m}$, operating at $\lambda_0 = 1.3\ \mu\text{m}$ in air. Find NA, the acceptance angle, $V$, and the approximate number of guided modes.

**P5.** For the same step-index multimode fibre:
(a) Derive the **intermodal (multipath) dispersion** — the delay difference per unit length between the axial ray and the ray at the critical angle — and show $\dfrac{\Delta\tau}{L} = \dfrac{n_1\Delta}{c}$ where $\Delta = \dfrac{n_1-n_2}{n_1}$.
(b) Evaluate it numerically for the fibre of P4 and estimate the **bandwidth–length product**.
(c) State how **graded-index** and **single-mode** fibres reduce this, and name the dispersion mechanism that then dominates.

**P6 (20-marker).** Explain the principle of **holography**.
(a) Set up the recording step: an object wave $O(x,y) = |O|e^{i\phi_O}$ and a mutually coherent reference wave $R(x,y) = |R|e^{i\phi_R}$ interfere at the plate. Write the recorded intensity and identify the four terms.
(b) Show that illuminating the developed hologram (amplitude transmittance linear in exposure) with the *same* reference wave reconstructs both a **virtual** image of the object and a **conjugate real** image.
(c) Explain why a hologram records **phase as well as amplitude**, why a broken piece still reproduces the whole scene, and why high **coherence** is essential.

**P7 (numerical — laser beam optics).** A He–Ne laser ($\lambda = 632.8\ \text{nm}$) has a Gaussian output beam with waist radius $w_0 = 0.50\ \text{mm}$.
(a) Find the far-field **half-angle divergence** $\theta \approx \lambda/\pi w_0$.
(b) Find the **Rayleigh range** $z_R = \pi w_0^2/\lambda$.
(c) Estimate the **diameter of the illuminated spot on the Moon** ($L = 3.8\times10^{8}\ \text{m}$), ignoring the atmosphere. Comment on the contrast with an ordinary lamp.

**P8 (optical activity).**
(a) State the phenomenon of **optical activity** and define **specific rotation**.
(b) Present **Fresnel's theory**: resolve plane-polarized light into left- and right-circularly polarized components travelling with different speeds, and derive the rotation of the plane of polarization $\theta = \dfrac{\pi d}{\lambda}\,(n_L - n_R)$.
(c) For quartz at $\lambda = 589\ \text{nm}$, $n_L - n_R = 7.1\times10^{-5}$. Find the rotation produced by a $1.0\ \text{mm}$ thick plate cut perpendicular to the optic axis.

---

## Key formulas used (quote these cold)

| # | Formula | Meaning |
|---|---|---|
| 1 | $B_{12} = B_{21}$ | absorption and stimulated emission are equally probable |
| 2 | $\dfrac{A_{21}}{B_{21}} = \dfrac{8\pi h\nu^3}{c^3}$ | Einstein relation (with $\rho$ per unit frequency) |
| 3 | $R = \dfrac{A_{21}}{B_{21}\rho} = e^{h\nu/k_BT}-1$ | spontaneous : stimulated ratio |
| 4 | $g_{\text{th}} = \alpha + \dfrac{1}{2L}\ln\dfrac{1}{R_1R_2}$ | laser threshold gain |
| 5 | $\text{NA} = n_0\sin\theta_a = \sqrt{n_1^2-n_2^2}$ | numerical aperture / acceptance angle |
| 6 | $V = \dfrac{2\pi a}{\lambda_0}\sqrt{n_1^2-n_2^2}$ ; single-mode if $V<2.405$ | normalized frequency |
| 7 | $M \approx V^2/2$ (step index), $V^2/4$ (graded) | number of guided modes |
| 8 | $\dfrac{\Delta\tau}{L} = \dfrac{n_1\Delta}{c} = \dfrac{n_1(n_1-n_2)}{n_2 c}$ | intermodal dispersion |
| 9 | $I = |O|^2+|R|^2+OR^*+O^*R$ | hologram recording |
| 10 | $\theta \approx \dfrac{\lambda}{\pi w_0}$, $z_R = \dfrac{\pi w_0^2}{\lambda}$ | Gaussian beam divergence, Rayleigh range |
| 11 | $\theta = \dfrac{\pi d}{\lambda}(n_L-n_R)$ | Fresnel rotation of the polarization plane |
| 12 | $S = \dfrac{\theta}{l\,C}$ | specific rotation (solutions; $l$ in dm, $C$ in g/cm³) |

---

## Worked solutions

### P1 — Einstein coefficients

**(a) The three processes.** Let $N_1, N_2$ be populations of the lower and upper levels, $h\nu = E_2 - E_1$, and $\rho(\nu)$ the spectral energy density.

- **Stimulated absorption:** rate $= N_1 B_{12}\rho(\nu)$
- **Spontaneous emission:** rate $= N_2 A_{21}$ (independent of $\rho$ — the atom decays on its own, with lifetime $t_{sp} = 1/A_{21}$)
- **Stimulated emission:** rate $= N_2 B_{21}\rho(\nu)$ (emitted photon is coherent with the stimulating one — same frequency, phase, polarization and direction; **this is the process a laser amplifies**)

**(b) Equilibrium.** In steady state, upward rate = downward rate:

$$N_1 B_{12}\,\rho(\nu) = N_2 A_{21} + N_2 B_{21}\,\rho(\nu)$$

Solve for $\rho$:

$$\rho(\nu) = \frac{A_{21}}{B_{12}\dfrac{N_1}{N_2} - B_{21}} = \frac{A_{21}/B_{21}}{\dfrac{B_{12}}{B_{21}}\dfrac{N_1}{N_2} - 1}$$

In thermal equilibrium the Boltzmann distribution (non-degenerate levels) gives

$$\frac{N_1}{N_2} = e^{(E_2-E_1)/k_BT} = e^{h\nu/k_BT}$$

so

$$\rho(\nu) = \frac{A_{21}/B_{21}}{\dfrac{B_{12}}{B_{21}}e^{h\nu/k_BT} - 1}$$

This must agree with **Planck's law** for every $T$:

$$\rho(\nu) = \frac{8\pi h\nu^3}{c^3}\cdot\frac{1}{e^{h\nu/k_BT}-1}$$

Matching the two expressions term by term:

$$\boxed{B_{12} = B_{21}}\qquad\text{and}\qquad \boxed{\frac{A_{21}}{B_{21}} = \frac{8\pi h\nu^3}{c^3}}$$

*(If the levels are degenerate with weights $g_1, g_2$, the first relation generalizes to $g_1B_{12} = g_2B_{21}$ — state this, UPSC likes the caveat.)*

**(c) Ratio.**

$$R = \frac{\text{spontaneous}}{\text{stimulated}} = \frac{N_2A_{21}}{N_2B_{21}\rho(\nu)} = \frac{A_{21}}{B_{21}\rho(\nu)} = \boxed{e^{h\nu/k_BT}-1}$$

**Physical reading.** $R = 1$ when $h\nu = k_BT\ln 2$. At $T = 300$ K:
- **Microwave** ($\nu \sim 10^{10}$ Hz): $h\nu/k_BT \sim 1.6\times10^{-3} \Rightarrow R \approx 1.6\times10^{-3} \ll 1$ — stimulated emission dominates naturally, which is why the **maser came first (1954)**.
- **Optical** ($\nu \sim 5\times10^{14}$ Hz): $R \sim 10^{33}$ — spontaneous emission utterly swamps stimulated emission in equilibrium. An optical laser is therefore impossible without driving the medium **far from equilibrium** (population inversion) *and* using a **resonant cavity** to build up the stimulated photon field. This is the entire justification for laser design.

---

### P2 — Threshold condition, inversion, and level schemes

**(a) Threshold.** Consider a wave making one **round trip** in the cavity. Over a length $L$ the intensity grows as $e^{(g-\alpha)L}$ ($g$ = gain per unit length, $\alpha$ = scattering/absorption loss per unit length). A round trip covers $2L$ and reflects off both mirrors:

$$I_{\text{after}} = I_0\,R_1R_2\,e^{2(g-\alpha)L}$$

Oscillation is sustained when the round-trip gain at least compensates the losses, $I_{\text{after}} \ge I_0$:

$$R_1R_2\,e^{2(g-\alpha)L} \ge 1 \;\Longrightarrow\; 2(g-\alpha)L \ge \ln\frac{1}{R_1R_2}$$

$$\boxed{g_{\text{th}} = \alpha + \frac{1}{2L}\ln\frac{1}{R_1R_2}}$$

Since gain is proportional to the inversion, $g = \sigma(\nu)\,\Delta N$ with $\Delta N = N_2 - (g_2/g_1)N_1$, the **threshold inversion** is $\Delta N_{\text{th}} = g_{\text{th}}/\sigma(\nu)$. Writing the stimulated cross-section in terms of the spontaneous lifetime,

$$\Delta N_{\text{th}} = \frac{8\pi n^2\nu^2\,t_{sp}\,\Delta\nu}{c^2}\,g_{\text{th}}$$

— note it grows as $\nu^2$, which is why **X-ray lasers are so hard**.

**(b) Population inversion and metastable states.** Ordinary matter has $N_2 < N_1$, so a beam is net *absorbed*. Amplification requires $N_2 > (g_2/g_1)N_1$ — a **population inversion**, a non-equilibrium state (formally a "negative temperature"). It cannot be achieved by optical pumping in a strict **two-level** system, because $B_{12} = B_{21}$ means pumping saturates at $N_2 = N_1$ at best. One therefore needs a **third (or fourth) level**, and the upper laser level must be **metastable** — a long lifetime ($\sim$ ms, forbidden by electric-dipole selection rules) so atoms accumulate there instead of decaying instantly.

**(c) Three-level vs four-level.**

| | Three-level (e.g. **ruby**, Cr³⁺:Al₂O₃, 694.3 nm) | Four-level (e.g. **Nd:YAG**, **He–Ne**) |
|---|---|---|
| Lower laser level | The **ground state** | An excited level **above** the ground state |
| Inversion requires | Pumping **more than half** the ground-state population up | Only a few atoms in the upper level — the lower level is nearly **empty** |
| Threshold pump power | **High** | **Low** |
| Operation | Usually **pulsed** | Easily **continuous-wave (CW)** |

The four-level scheme wins because the lower laser level lies $\gg k_BT$ above the ground state, so it is thermally almost unpopulated ($N \propto e^{-\Delta E/k_BT}$) *and* empties rapidly by fast non-radiative decay to the ground state. Inversion is therefore achieved essentially **as soon as pumping begins**, whereas ruby must first "fill half the tank."

---

### P3 — He–Ne laser and the emission ratio

**(a) Construction and working.**

*Construction:* a narrow-bore glass discharge tube (~30 cm) containing He and Ne in roughly **10:1** ratio at ~1 torr total pressure, with a DC (or RF) electrode pair, sealed with **Brewster windows** (which polarize the output), placed between a high-reflector and a partially transmitting output coupler forming the optical cavity.

*Working:*
1. The electric discharge accelerates electrons, which **collisionally excite helium** to its metastable states $2^1S_0$ (20.61 eV) and $2^3S_1$ (19.82 eV). He is chosen because these states are metastable and so accumulate population.
2. These He levels are **almost exactly resonant** with the Ne levels $5s$ (20.66 eV) and $4s$ (19.78 eV). **Resonant collisional energy transfer** He\* + Ne → He + Ne\* pumps neon selectively; the small energy mismatch (~0.05 eV) is made up from kinetic energy.
3. **Neon is the actual lasing species.** Population inversion is established between the $5s$ and $3p$ levels → the famous red **632.8 nm** line (also $3.39\ \mu$m from $5s\to4p$ and $1.15\ \mu$m from $4s\to3p$).
4. The $3p$ lower laser level decays fast (~10 ns) to $3s$, and the $3s$ metastable level is de-excited by **collisions with the tube walls** — this is why the bore must be narrow, and it makes He–Ne a genuine **four-level CW laser**.

**(b) Numerical.**

$$\nu = \frac{c}{\lambda} = \frac{3\times10^{8}}{632.8\times10^{-9}} = 4.74\times10^{14}\ \text{Hz}$$

$$h\nu = (6.626\times10^{-34})(4.74\times10^{14}) = 3.14\times10^{-19}\ \text{J}\;(\approx 1.96\ \text{eV})$$

$$k_BT = (1.38\times10^{-23})(300) = 4.14\times10^{-21}\ \text{J}\;(\approx 0.026\ \text{eV})$$

$$\frac{h\nu}{k_BT} = \frac{3.14\times10^{-19}}{4.14\times10^{-21}} = 75.9$$

$$R = e^{75.9}-1 \approx \boxed{9\times10^{32}}$$

**Conclusion.** In thermal equilibrium, spontaneous emission outnumbers stimulated emission by ~$10^{33}$ to 1. Laser action at optical frequencies is therefore *impossible* in equilibrium; it demands a strongly inverted medium plus a cavity that recycles photons through the gain medium many times so that stimulated emission can win.

---

### P4 — Step-index fibre: NA, acceptance angle, V-number

**(a) Acceptance angle and NA.** Light enters the flat end face from a medium of index $n_0$ at angle $\theta_0$ to the axis, refracts into the core at $\theta_1$, and strikes the core–cladding boundary at angle $\phi = 90^\circ - \theta_1$ (measured from the *normal* to that boundary).

Total internal reflection at the core–cladding interface requires

$$\phi \ge \phi_c, \qquad \sin\phi_c = \frac{n_2}{n_1}$$

Snell's law at the entrance face: $n_0\sin\theta_0 = n_1\sin\theta_1 = n_1\cos\phi$.

The largest acceptable $\theta_0$ corresponds to $\phi = \phi_c$:

$$n_0\sin\theta_a = n_1\cos\phi_c = n_1\sqrt{1-\sin^2\phi_c} = n_1\sqrt{1-\frac{n_2^2}{n_1^2}} = \sqrt{n_1^2-n_2^2}$$

$$\boxed{\text{NA} \equiv n_0\sin\theta_a = \sqrt{n_1^2-n_2^2}}$$

Rays launched within the **acceptance cone** of half-angle $\theta_a$ are guided; all others leak into the cladding. Note NA is a property of the fibre alone, independent of $n_0$.

**(b) V-number.** Solving the wave equation with the boundary conditions shows the guided modes depend on a single dimensionless parameter,

$$V = \frac{2\pi a}{\lambda_0}\sqrt{n_1^2-n_2^2} = \frac{2\pi a}{\lambda_0}\,\text{NA}$$

- $V < 2.405$ (the first zero of $J_0$): only the fundamental $\text{LP}_{01}$ mode propagates → **single-mode fibre**.
- $V \gg 1$: number of guided modes $M \approx V^2/2$ (step-index), $V^2/4$ (parabolic graded-index).

**(c) Numbers.** $n_1 = 1.48$, $n_2 = 1.46$, $a = 25\ \mu$m, $\lambda_0 = 1.3\ \mu$m, $n_0 = 1$.

$$\text{NA} = \sqrt{1.48^2-1.46^2} = \sqrt{2.1904-2.1316} = \sqrt{0.0588} = \boxed{0.2425}$$

$$\theta_a = \sin^{-1}(0.2425) = \boxed{14.0^\circ}\quad(\text{full acceptance cone} \approx 28^\circ)$$

$$V = \frac{2\pi(25)}{1.3}(0.2425) = (120.83)(0.2425) = \boxed{29.3}$$

$$M \approx \frac{V^2}{2} = \frac{858}{2} \approx \boxed{429\ \text{modes}}$$

Since $V \gg 2.405$, this is a **multimode** fibre — which sets up the dispersion problem in P5.

---

### P5 — Intermodal dispersion and bandwidth

**(a) Derivation.** Compare the two extreme ray paths over a fibre of length $L$:

- **Axial ray** (fastest): path length $L$, speed $c/n_1$, so $\tau_{\min} = \dfrac{Ln_1}{c}$.
- **Critical ray** (slowest): it zig-zags at the critical angle, so its geometric path is $L/\sin\phi_c = L n_1/n_2$, giving $\tau_{\max} = \dfrac{n_1}{c}\cdot\dfrac{Ln_1}{n_2} = \dfrac{Ln_1^2}{c\,n_2}$.

The pulse spread is the difference:

$$\Delta\tau = \tau_{\max}-\tau_{\min} = \frac{Ln_1}{c}\left(\frac{n_1}{n_2}-1\right) = \frac{Ln_1}{c}\cdot\frac{n_1-n_2}{n_2}$$

With $\Delta \equiv \dfrac{n_1-n_2}{n_1}$ and using $n_2 \approx n_1$ (weakly guiding fibres, $\Delta \sim 1\%$):

$$\boxed{\frac{\Delta\tau}{L} = \frac{n_1\Delta}{c}}$$

**(b) Numbers** (fibre of P4): $\Delta = \dfrac{1.48-1.46}{1.48} = 0.01351$.

$$\frac{\Delta\tau}{L} = \frac{(1.48)(0.01351)}{3\times10^{8}} = \frac{0.02}{3\times10^{8}} = 6.67\times10^{-11}\ \text{s/m} = \boxed{66.7\ \text{ns/km}}$$

A 1 km link therefore smears a delta-function input into a ~67 ns pulse. Using the standard criterion $B \approx 1/(2\Delta\tau)$:

$$B \approx \frac{1}{2(66.7\times10^{-9})} \approx \boxed{7.5\ \text{MHz}\cdot\text{km}}$$

i.e. ~7.5 Mb/s over 1 km, or ~750 kb/s over 10 km. Hopelessly inadequate for telecom — hence:

**(c) Fixes.**
- **Graded-index fibre:** a near-parabolic $n(r)$ makes off-axis rays travel their longer paths through *lower*-index (faster) regions, equalizing transit times. This reduces intermodal dispersion by roughly $\Delta/2$ — a factor of ~100–200 — giving GHz·km bandwidths.
- **Single-mode fibre ($V < 2.405$):** intermodal dispersion is **eliminated entirely** — there is only one mode. What then dominates is **chromatic dispersion**, itself the sum of *material dispersion* ($dn/d\lambda$, from the source linewidth) and *waveguide dispersion* (the mode's field distribution shifting between core and cladding with $\lambda$). These two have opposite signs and cancel near $\lambda \approx 1.31\ \mu$m in conventional silica fibre — the "zero-dispersion window." Since silica's *loss* minimum is at $1.55\ \mu$m, **dispersion-shifted fibre** is engineered to move the zero to $1.55\ \mu$m so both optima coincide.

---

### P6 — Holography

**(a) Recording.** Let the object wave at the plate be $O(x,y) = |O|e^{i\phi_O}$ and a mutually coherent reference (typically a plane or spherical) wave be $R(x,y) = |R|e^{i\phi_R}$. The plate responds to intensity:

$$I = |O+R|^2 = (O+R)(O+R)^*$$

$$\boxed{I = \underbrace{|O|^2}_{(1)} + \underbrace{|R|^2}_{(2)} + \underbrace{OR^*}_{(3)} + \underbrace{O^*R}_{(4)}}$$

Terms (1) and (2) are the self-intensities — a slowly varying background. **Terms (3) and (4) are the interesting ones:** they carry $e^{i(\phi_O-\phi_R)}$ and $e^{-i(\phi_O-\phi_R)}$, i.e. the **phase** of the object wave is encoded as the *position* of interference fringes on the plate. This is precisely what an ordinary photograph throws away.

**(b) Reconstruction.** Develop the plate so its amplitude transmittance is linear in exposure:

$$t(x,y) = t_0 - \beta I(x,y)$$

Now illuminate with the *same* reference wave $R$. The transmitted field is

$$\psi = tR = t_0R - \beta\left(|O|^2R + |R|^2R + |R|^2O + R^2O^*\right)$$

Identify the terms:

- $\left(t_0 - \beta|R|^2\right)R - \beta|O|^2R$ → the **directly transmitted (zero-order) beam**, slightly modulated.
- $-\beta|R|^2\,O$ → since $|R|^2$ is a constant for a uniform reference, this is **an exact replica of the original object wave**, up to a constant factor. An observer looking through the plate sees a fully **three-dimensional virtual image** at the original object location, with parallax — moving the head reveals hidden sides.
- $-\beta R^2 O^*$ → the **conjugate wave**, which converges to form a **real image** (pseudoscopic, depth-inverted) on the other side, which can be caught on a screen without a lens.

With an **off-axis (Leith–Upatnieks) reference beam**, $\phi_R$ carries a linear phase ramp, which angularly separates these three terms so the twin images do not overlap — the key practical advance over Gabor's original in-line geometry.

**(c) Discussion.**
- **Phase is recorded** because the reference wave converts phase differences into intensity fringes ($OR^*$ terms) that the plate *can* record. A photograph records $|O|^2$ only, losing $\phi_O$ and with it all depth information.
- **A broken fragment reproduces the whole scene** because every object point scatters light onto essentially the *entire* plate — the information is **delocalized**, stored globally rather than point-by-point. A small piece is a smaller "window" on the scene: the full image is still there but with reduced resolution (a smaller aperture → larger diffraction limit) and a narrower viewing angle.
- **Coherence is essential** because the fringes that encode the phase form only if the object and reference waves stay in fixed phase relation across the plate. The path difference must stay within the coherence length $L_c = \lambda^2/\Delta\lambda$ — which is why holography was impossible before the laser, and why the whole apparatus must be vibration-isolated to sub-$\lambda/4$ stability during exposure.

---

### P7 — Gaussian beam numerical

**(a) Divergence.**

$$\theta \approx \frac{\lambda}{\pi w_0} = \frac{632.8\times10^{-9}}{\pi(0.50\times10^{-3})} = \frac{632.8\times10^{-9}}{1.571\times10^{-3}} = \boxed{4.0\times10^{-4}\ \text{rad}} \approx 0.023^\circ$$

**(b) Rayleigh range** (distance over which the beam area doubles):

$$z_R = \frac{\pi w_0^2}{\lambda} = \frac{\pi(0.50\times10^{-3})^2}{632.8\times10^{-9}} = \frac{7.854\times10^{-7}}{6.328\times10^{-7}} = \boxed{1.24\ \text{m}}$$

**(c) Spot on the Moon.** In the far field ($L \gg z_R$), the beam radius is $w(L) \approx \theta L$, so the **diameter** is

$$D = 2\theta L = 2(4.03\times10^{-4})(3.8\times10^{8}) = \boxed{\approx 3.1\times10^{5}\ \text{m} \approx 310\ \text{km}}$$

**Comment.** Even a "perfectly collimated" laser spreads — diffraction sets the floor $\theta \sim \lambda/\pi w_0$, and the only way to reduce it is to *expand* the beam first (a $10\times$ telescope gives a $10\times$ smaller divergence, and the Apollo lunar-ranging retroreflector experiments did exactly this, reaching a few km spot). Contrast an ordinary lamp, which is **spatially incoherent** and radiates into $4\pi$ steradians: at the Moon its "spot" is the entire visible hemisphere and its irradiance is lower by ~15 orders of magnitude. The laser's advantage is *directionality born of spatial coherence*, not raw power.

---

### P8 — Optical activity and Fresnel's theory

**(a) Statement.** Certain substances (quartz cut ⊥ to the optic axis, sugar solution, turpentine, sodium chlorate) rotate the **plane of vibration** of plane-polarized light passing through them. Substances rotating it clockwise (viewed *towards* the source) are **dextrorotatory**, anticlockwise **laevorotatory**. Empirically the rotation $\theta \propto$ path length, and for solutions $\propto$ concentration:

$$\theta = S\,l\,C \quad\Longrightarrow\quad \boxed{S = \frac{\theta}{l\,C}}$$

where $S$ is the **specific rotation** at a given $\lambda$ and $T$ (conventionally $l$ in decimetres, $C$ in g cm⁻³). Rotation increases sharply at shorter wavelengths — **rotatory dispersion**, roughly $\theta \propto 1/\lambda^2$.

**(b) Fresnel's theory.** Fresnel's postulate: *a plane-polarized wave is the superposition of a left- and a right-circularly polarized wave of equal amplitude, and in an optically active medium these travel with different speeds* ($n_L \ne n_R$ — **circular birefringence**).

Take the incident wave along $z$, polarized along $x$, at $z=0$:

$$\mathbf{E} = E_0\hat{x}\cos\omega t = \underbrace{\frac{E_0}{2}\big(\hat x\cos\omega t + \hat y\sin\omega t\big)}_{\text{one circular component}} + \underbrace{\frac{E_0}{2}\big(\hat x\cos\omega t - \hat y\sin\omega t\big)}_{\text{the other}}$$

— two counter-rotating vectors of amplitude $E_0/2$, whose resultant is always along $\hat x$.

After traversing thickness $d$, the two components have accumulated phases

$$\delta_L = \frac{2\pi n_L d}{\lambda}, \qquad \delta_R = \frac{2\pi n_R d}{\lambda}$$

Writing $\bar\delta = \tfrac12(\delta_L+\delta_R)$ and $\Delta\delta = \delta_L - \delta_R$, the emergent field is

$$\mathbf{E}' = \frac{E_0}{2}\begin{pmatrix}\cos(\omega t - \delta_L)\\ \sin(\omega t-\delta_L)\end{pmatrix} + \frac{E_0}{2}\begin{pmatrix}\cos(\omega t-\delta_R)\\ -\sin(\omega t-\delta_R)\end{pmatrix}$$

Adding componentwise with the sum-to-product identities:

$$E'_x = E_0\cos\!\Big(\omega t - \bar\delta\Big)\cos\!\frac{\Delta\delta}{2}, \qquad E'_y = E_0\cos\!\Big(\omega t-\bar\delta\Big)\sin\!\frac{\Delta\delta}{2}$$

Both components oscillate **in phase** with the same time dependence — so the emergent light is still **plane-polarized** (this is the crux: circular birefringence rotates, it does not ellipticize). Its plane makes angle

$$\tan\theta = \frac{E'_y}{E'_x} = \tan\frac{\Delta\delta}{2} \;\Longrightarrow\; \theta = \frac{\Delta\delta}{2} = \frac{1}{2}\cdot\frac{2\pi d}{\lambda}(n_L-n_R)$$

$$\boxed{\theta = \frac{\pi d}{\lambda}\,(n_L - n_R)}$$

If $n_L > n_R$ the RCP component travels faster and the rotation is one way; reversing the inequality reverses the handedness. (Compare with **linear** birefringence in a wave plate, where the two components are *orthogonal linear* states and the output is generally *elliptical* — that contrast is a favourite follow-up question.)

**(c) Numerical.** $d = 1.0\ \text{mm} = 1.0\times10^{-3}$ m, $\lambda = 589\times10^{-9}$ m, $n_L - n_R = 7.1\times10^{-5}$:

$$\theta = \frac{\pi(1.0\times10^{-3})(7.1\times10^{-5})}{589\times10^{-9}} = \frac{2.231\times10^{-7}}{5.89\times10^{-7}} = 0.3787\ \text{rad}$$

$$\theta = 0.3787 \times \frac{180}{\pi} = \boxed{21.7^\circ}$$

This matches the tabulated value for quartz (~21.7° per mm at the sodium D line) — a good self-check, and a number worth remembering because UPSC has used quartz-plate rotation numericals repeatedly.

---

## Recurring-pattern insights

**1. The Einstein-coefficient derivation is the single most reliable question in this entire block.** In some form — full derivation, "show $B_{12}=B_{21}$", or "compute the ratio of spontaneous to stimulated emission at temperature $T$" — it appears with near-annual regularity, usually as a 15–20 marker. The derivation is **short and completely scripted**: rate equation → solve for $\rho$ → insert Boltzmann → compare with Planck. There is no place to get stuck and no algebra to fumble. Treat it as guaranteed marks. The examiner's discriminator is whether you *also* comment on the physical consequence (why masers preceded lasers, why the medium must be inverted) — that paragraph is where the last 4–5 marks live, and most candidates omit it.

**2. Fibre-optics questions are almost always the same three-step numerical wearing different clothes: NA → acceptance angle → V-number → number of modes.** The numbers change, the structure does not. What varies is which quantity is left unknown — sometimes you are given $V$ and asked for the maximum core radius for single-mode operation, sometimes given NA and asked for $\Delta$. Because the chain $\text{NA}=\sqrt{n_1^2-n_2^2} \to \theta_a \to V=\tfrac{2\pi a}{\lambda}\text{NA} \to M\approx V^2/2$ is so short, you should be able to do the whole thing in under six minutes. The one place candidates lose marks is forgetting that the acceptance angle depends on the launch medium ($n_0\sin\theta_a = \text{NA}$) while NA itself does not.

**3. UPSC repeatedly pairs a "describe the device" part with a "derive/compute" part in the same question.** Ruby vs He–Ne construction alongside the threshold condition; the holography setup alongside the four-term intensity expansion; the fibre structure alongside the NA derivation. Candidates who prepare only the mathematics lose the descriptive half, and vice versa. For every device in this block — He–Ne, ruby, Nd:YAG, step-index and graded-index fibre, the holographic recording geometry — you should have a **labelled diagram plus five sentences** memorized, because those are worth roughly half the marks and take a fraction of the time to write.

---

## One tip

**Build a one-page "orders of magnitude" card for this block and revise it before every test.** This section is unusually numerical, and UPSC's numericals almost always land on the same physical scales — He–Ne at 632.8 nm and 1.96 eV; $h\nu/k_BT \approx 76$ at room temperature for visible light; typical fibre NA of 0.2–0.3 and acceptance angle 12–17°; $\Delta \sim 1\%$; intermodal dispersion tens of ns/km for step-index; single-mode cutoff $V = 2.405$; quartz rotating ~21.7°/mm at the D line; laser divergence of a fraction of a milliradian. Knowing these lets you **sanity-check every answer in five seconds**. If your computed acceptance angle comes out at 45°, or your rotation at 200°, you have made an arithmetic slip and can catch it before it costs you the question — which matters enormously in an exam where a single misplaced power of ten can void an otherwise perfect eight-minute derivation.
