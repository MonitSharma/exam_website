# Physics Optional PYQ Plan — week of 2026-08-11

**Paper II · Quantum Mechanics (Part 2) · Topic: Approximation Methods (Variational, WKB, Time-Dependent PT) & Scattering Theory**

> **Why this topic now:** Last week (`2026-08-04`) opened Paper II with **QM Part 1** — formalism, 1-D potentials, the oscillator, angular momentum, hydrogen, time-*independent* perturbation theory and spin. That plan explicitly flagged **QM Part 2** as the next slot, and this is the start of fortnight **F6 (11–24 Aug)**. The block below is the other half of the QM syllabus and the half students skip: the **variational method**, **WKB**, **time-dependent perturbation theory / Fermi's Golden Rule**, and **scattering** (partial waves + Born approximation). UPSC asks from this half nearly every year, and because most candidates under-prepare it, the marks-per-hour here is the highest in Paper II. It is also load-bearing: the Gamow factor feeds **Nuclear Physics** (alpha decay), Fermi's Golden Rule feeds **Atomic & Molecular** (selection rules, transition rates), and the exchange interaction feeds **Solid State** (ferromagnetism) and **Atomic** (ortho/para helium). Doing it now makes the next three fortnights cheaper.

**Rotation tracker — Paper I (complete):** Lagrangian/Hamiltonian ✅ · Central force ✅ · Rigid body ✅ · Electrodynamics ✅ · Optics Pt 1 ✅ · Optics Pt 2 ✅ · Thermo & Stat Mech ✅
**Paper II:** QM Part 1 ✅ (`2026-08-04`) · **QM Part 2 — this week**
**Still to rotate through (Paper II):** Atomic & Molecular Physics · Nuclear & Particle Physics · Solid State · Electronics · Special Relativity.

---

## How to use this set (timed)

**Two things this week — a full paper *and* a topic set.**

**(A) Full-length timed paper — Saturday, 3 hours, exam conditions.**
Sit **UPSC CSE 2023 Physics Paper II** end-to-end: 3 hours, no book, answer-booklet format, Section A + Section B with the compulsory questions. Download it from the UPSC site (link below). This is your first *full* Paper II attempt since the June diagnostic (`Physics_Optional_Paper_II_2026-06-15.md`) — the point is not the score, it is (i) whether you can fill 3 hours without running dry, and (ii) which sections you instinctively skip. Log the skipped sections; those are the next fortnights' targets. Going forward, work backwards one year per fortnight — 2023 → 2022 → 2021 … — so the ~20-year sweep completes over the cycle.

**(B) Topic set — the 8 problems below, closed-book, ~110 minutes.**

1. Treat **P1, P4, P6** as 20-markers; **P2, P3, P7, P8** as 15-markers; **P5** as a 15-mark derivation-plus-numerical.
2. **Say out loud which approximation you are invoking and why it is valid.** This section is *entirely* about approximation schemes, and UPSC gives explicit marks for the validity statement: *"WKB is valid where the de Broglie wavelength varies slowly, |dλ/dx| ≪ 1, hence it fails at the turning points"*, *"first-order PT requires |H′| ≪ level spacing"*, *"the Born approximation assumes the incident wave is barely distorted, i.e. high energy / weak potential"*, *"only ℓ = 0 contributes when ka ≪ 1"*. A perfect derivation with no validity statement loses 3–4 marks every time.
3. **Sketch it.** The turning-point diagram and the classically forbidden region (P4, P5), the Coulomb barrier with the α-particle level inside it (P5), the incident-plane-wave-plus-outgoing-spherical-wave geometry (P6), the singlet/triplet level splitting of the He 1s2s configuration (P8). Cheapest marks in the paper.
4. **Then** check against the worked solutions below, and log every boxed result into your **Formula & Derivation Master Log** under *"Quantum Mechanics — Approximation Methods & Scattering."*
5. **Source the real papers yourself:** UPSC official site (`upsc.gov.in` → *Examination → Previous Year Question Papers*) → download the **Physics Paper II** PDFs across the last ~20 years. Search each for `"variational"`, `"trial wave function"`, `"WKB"`, `"Bohr-Sommerfeld"`, `"connection formula"`, `"Gamow"`, `"alpha decay"`, `"tunnelling"`, `"Fermi golden rule"`, `"transition probability"`, `"time-dependent perturbation"`, `"sudden approximation"`, `"adiabatic"`, `"partial wave"`, `"phase shift"`, `"optical theorem"`, `"scattering length"`, `"Born approximation"`, `"screened Coulomb"`, `"Yukawa"`, `"identical particles"`, `"exchange"`, `"ortho"`, `"para"`. Texts that mirror UPSC phrasing: **Griffiths** Ch. 7–11 (closest to UPSC's wording and problem style), **Zettili** Ch. 9–11 (worked-example format — best for exam practice), **Schiff** and **Sakurai** for the formal scattering theory, **Mathews & Venkatesan** Vol. 2 for the Indian-syllabus treatment of WKB and partial waves.

> ⚠️ **Honesty note:** The 8 problems below are **representative UPSC-style** items built on the exact derivations and numericals UPSC repeats in this section. They are **not** claimed to be verbatim past questions — treat the specific wording as mine, not UPSC's. The *only* real, verbatim paper this week is the one you download in part (A). Pull the actual Paper II PDFs from `upsc.gov.in` for exact phrasing and mark allocation. **Never treat the problems below as the real paper.**

---

## Problems (representative UPSC-style — closed-book attempt first)

**P1 (the perennial 20-marker — time-dependent perturbation theory).**
A system with unperturbed Hamiltonian $\hat H_0$ and eigenstates $|n\rangle$, $\hat H_0|n\rangle = E_n|n\rangle$, is subjected to a perturbation $\hat H'(t)$ switched on at $t=0$.
(a) Set up the time-dependent perturbation expansion and obtain the **first-order amplitude** $c_f^{(1)}(t)$ for a transition $|i\rangle \to |f\rangle$.
(b) For a **constant** perturbation switched on at $t=0$, show that the transition probability is
$$P_{i\to f}(t) = \frac{|H'_{fi}|^2}{\hbar^2}\,\frac{4\sin^2\!\big(\omega_{fi}t/2\big)}{\omega_{fi}^2},\qquad \omega_{fi}=\frac{E_f-E_i}{\hbar},$$
and hence derive **Fermi's Golden Rule** $W_{i\to f} = \dfrac{2\pi}{\hbar}\,|H'_{fi}|^2\,\rho(E_f)$.
(c) For a **harmonic** perturbation $\hat H'(t) = \hat V e^{-i\omega t} + \hat V^\dagger e^{+i\omega t}$, obtain the golden rule for absorption and stimulated emission, and identify the resonance condition.
(d) State the conditions of validity of first-order theory.

**P2 (sudden approximation — the classic tritium question).**
State the **sudden approximation** and its condition of validity. A tritium atom $^3$H in its electronic ground state undergoes beta decay, $^3\mathrm{H}\to{}^3\mathrm{He}^+ + e^- + \bar\nu_e$, so that the nuclear charge changes abruptly from $Z=1$ to $Z=2$ while the atomic electron's wavefunction has no time to change.
(a) Justify why the sudden approximation applies here (compare the beta-electron transit time with the orbital period).
(b) Compute the probability that the atomic electron is found in the **ground state** of the resulting $^3$He$^+$ ion.
(c) Hence state the probability that the ion is left **excited or ionised**.

**P3 (variational method).**
(a) State and **prove** the variational principle: for any normalised trial state $|\psi\rangle$, $\langle\psi|\hat H|\psi\rangle \ge E_0$.
(b) Using the **Gaussian trial function** $\psi(r) = A e^{-\alpha r^2}$ (which has the *wrong* asymptotic form), estimate the ground-state energy of the hydrogen atom. Compare with the exact $-13.6$ eV and comment on the sign and size of the error.
(c) Explain why the variational method gives an excellent *energy* even from a poor *wavefunction*, and why the same is **not** true for other expectation values.

**P4 (WKB — the 20-marker).**
(a) Derive the **WKB wavefunction** by substituting $\psi = \exp[iS(x)/\hbar]$ into the time-independent Schrödinger equation and expanding $S$ in powers of $\hbar$. Obtain the form in the classically allowed and forbidden regions and state the **validity condition**.
(b) Explain why WKB breaks down at a classical turning point, quote the **connection formulae**, and hence derive the **Bohr–Sommerfeld quantisation condition** for a potential well with two smooth turning points,
$$\int_{x_1}^{x_2} p(x)\,dx = \left(n+\tfrac12\right)\pi\hbar,\qquad n=0,1,2,\dots$$
(c) Apply it to the **linear harmonic oscillator** and show the WKB result is *exact*.
(d) Apply it to the symmetric linear potential $V(x) = F|x|$ and obtain the energy levels.

**P5 (WKB tunnelling → alpha decay; derivation + numerical).**
(a) For a barrier in the WKB regime, derive the transmission coefficient
$$T \simeq \exp\left[-\frac{2}{\hbar}\int_{x_1}^{x_2}\sqrt{2m\big(V(x)-E\big)}\,dx\right].$$
(b) Apply this to **alpha decay** with the Coulomb barrier $V(r) = \dfrac{2Z'e^2}{4\pi\varepsilon_0 r}$ outside the nuclear radius $R$ ($Z'$ = charge of the *daughter* nucleus), and derive the **Gamow factor**
$$2\gamma = \frac{2b\sqrt{2mE}}{\hbar}\left[\cos^{-1}\!\sqrt{x} - \sqrt{x(1-x)}\right],\quad x=\frac{R}{b},\quad b=\frac{2Z'e^2}{4\pi\varepsilon_0 E}.$$
Show that in the limit $R \ll b$ this reduces to $2\gamma \to \dfrac{2\pi\,(2Z')e^2}{4\pi\varepsilon_0 \hbar v}$, and hence obtain the **Geiger–Nuttall law** $\ln\lambda = a - b/\sqrt{E}$.
(c) **Numerical:** For $^{238}$U $\to$ $^{234}$Th $+\ \alpha$ with $E_\alpha = 4.27$ MeV, $Z'=90$, and $R = 1.2\,(A_d^{1/3}+4^{1/3})$ fm, evaluate $b$, $x$, the Gamow exponent and the barrier penetrability $T$. Comment on the size of the number.

**P6 (partial-wave analysis — 20-marker).**
(a) Set up the scattering problem: write the asymptotic form $\psi \sim e^{ikz} + f(\theta)\,e^{ikr}/r$ and relate $d\sigma/d\Omega$ to $f(\theta)$.
(b) Expand in partial waves and derive
$$f(\theta) = \frac{1}{k}\sum_{\ell=0}^{\infty}(2\ell+1)\,e^{i\delta_\ell}\sin\delta_\ell\,P_\ell(\cos\theta),\qquad \sigma_{\text{tot}} = \frac{4\pi}{k^2}\sum_\ell (2\ell+1)\sin^2\delta_\ell.$$
(c) Prove the **optical theorem** $\sigma_{\text{tot}} = \dfrac{4\pi}{k}\,\mathrm{Im}\,f(0)$ and explain its physical content.
(d) Compute $\delta_0$ for scattering off a **hard sphere** of radius $a$. Show that at low energy $\sigma \to 4\pi a^2$ — *four times* the geometrical cross-section — and at high energy $\sigma \to 2\pi a^2$. Define the **scattering length** and evaluate it for the hard sphere.
(e) Justify the rule of thumb that only partial waves with $\ell \lesssim ka$ contribute.

**P7 (Born approximation).**
(a) Starting from the integral (Lippmann–Schwinger) form of the Schrödinger equation with the outgoing Green's function, derive the **first Born approximation**
$$f_B(\mathbf q) = -\frac{m}{2\pi\hbar^2}\int e^{i\mathbf q\cdot\mathbf r}\,V(\mathbf r)\,d^3r ,\qquad \mathbf q = \mathbf k_i - \mathbf k_f,\ \ q = 2k\sin(\theta/2),$$
and reduce it for a **central** potential to $f_B(q) = -\dfrac{2m}{\hbar^2 q}\displaystyle\int_0^\infty r\,V(r)\sin(qr)\,dr$.
(b) Evaluate $f_B$ and $d\sigma/d\Omega$ for the **screened Coulomb (Yukawa) potential** $V(r) = V_0\,e^{-\mu r}/r$.
(c) Take the limit $\mu\to0$, $V_0 \to Z_1Z_2e^2/4\pi\varepsilon_0$ and recover the **Rutherford cross-section**. Comment on the remarkable fact that Born, classical and exact quantum treatments all agree for the Coulomb potential.
(d) State the validity criteria of the Born approximation.

**P8 (identical particles and exchange).**
(a) State the **symmetrisation postulate**. Construct the two-particle wavefunctions for bosons and fermions and obtain the **Pauli exclusion principle** as a corollary.
(b) Two non-interacting identical particles occupy an infinite square well of width $L$. Find the ground-state energy if the particles are (i) distinguishable, (ii) identical spinless bosons, (iii) identical spin-$\tfrac12$ fermions. Give the degeneracy of the first excited level in each case.
(c) Show that for a two-electron atom the spatially symmetric (spin-singlet) and antisymmetric (spin-triplet) states are split by $E = J \pm K$, where $J$ is the direct and $K$ the **exchange** integral. Apply this to the **1s2s configuration of helium** and explain why **ortho**-helium lies *below* **para**-helium even though the Hamiltonian contains no spin-dependent term.
(d) Show that the exchange term makes identical bosons effectively *attract* and identical fermions effectively *repel* — the "exchange force".

---

## Key formulas (quote these cold)

| Result | Formula |
|---|---|
| First-order amplitude | $c_f^{(1)}(t) = \dfrac{1}{i\hbar}\displaystyle\int_0^t H'_{fi}(t')\,e^{i\omega_{fi}t'}\,dt'$ |
| Fermi's Golden Rule | $W_{i\to f} = \dfrac{2\pi}{\hbar}\,\big|H'_{fi}\big|^2\,\rho(E_f)$ |
| Harmonic perturbation | $W = \dfrac{2\pi}{\hbar}\big|V_{fi}\big|^2\,\delta(E_f - E_i \mp \hbar\omega)$ |
| Sudden approximation | $P_{i\to f} = \big|\langle \phi_f^{\text{new}} \mid \psi_i^{\text{old}}\rangle\big|^2$ |
| 1s–1s overlap (different $Z$) | $\langle 1s,Z_2|1s,Z_1\rangle = \dfrac{8\,(Z_1Z_2)^{3/2}}{(Z_1+Z_2)^3}$ |
| Variational principle | $E_0 \le \dfrac{\langle\psi|\hat H|\psi\rangle}{\langle\psi|\psi\rangle}$ |
| WKB wavefunction | $\psi \simeq \dfrac{C}{\sqrt{p(x)}}\exp\!\left[\pm\dfrac{i}{\hbar}\displaystyle\int p\,dx\right]$, $p=\sqrt{2m(E-V)}$ |
| WKB validity | $\left|\dfrac{d\bar\lambda}{dx}\right| \ll 1 \iff \dfrac{m\hbar|V'|}{p^3}\ll1$, $\ \bar\lambda = \hbar/p$ |
| Bohr–Sommerfeld (2 smooth turning points) | $\displaystyle\int_{x_1}^{x_2} p\,dx = \left(n+\tfrac12\right)\pi\hbar$ |
| (one rigid wall + one turning point) | $\displaystyle\int_{0}^{x_2} p\,dx = \left(n+\tfrac34\right)\pi\hbar$ |
| WKB barrier penetration | $T \simeq e^{-2\gamma},\ \ \gamma = \dfrac1\hbar\displaystyle\int_{x_1}^{x_2}\sqrt{2m(V-E)}\,dx$ |
| Gamow (point-nucleus limit) | $2\gamma = \dfrac{2\pi Z_1Z_2 e^2}{4\pi\varepsilon_0\hbar v}$ |
| Geiger–Nuttall | $\ln\lambda = a - b/\sqrt{E}$ |
| Partial-wave amplitude | $f(\theta) = \dfrac1k\sum_\ell (2\ell+1)e^{i\delta_\ell}\sin\delta_\ell\,P_\ell(\cos\theta)$ |
| Total cross-section | $\sigma = \dfrac{4\pi}{k^2}\sum_\ell (2\ell+1)\sin^2\delta_\ell$ |
| Optical theorem | $\sigma_{\text{tot}} = \dfrac{4\pi}{k}\,\mathrm{Im}\,f(0)$ |
| Scattering length | $a_s = -\lim_{k\to0}\dfrac{\tan\delta_0}{k}$, $\ \sigma_{k\to0} = 4\pi a_s^2$ |
| Born amplitude (central $V$) | $f_B(q) = -\dfrac{2m}{\hbar^2 q}\displaystyle\int_0^\infty rV(r)\sin(qr)\,dr$ |
| Yukawa | $f_B = -\dfrac{2mV_0}{\hbar^2(\mu^2+q^2)}$ |
| Rutherford | $\dfrac{d\sigma}{d\Omega} = \left(\dfrac{Z_1Z_2e^2}{16\pi\varepsilon_0 E}\right)^{\!2}\dfrac{1}{\sin^4(\theta/2)}$ |
| Exchange splitting | $E_\pm = J \pm K$ (+ singlet, − triplet) |

---

# Worked Solutions

## P1 — Time-dependent perturbation theory and Fermi's Golden Rule

### (a) The expansion

Write $\hat H = \hat H_0 + \lambda \hat H'(t)$ and expand the state in the unperturbed basis with the free phases factored out:
$$|\psi(t)\rangle = \sum_n c_n(t)\, e^{-iE_n t/\hbar}\,|n\rangle .$$

Insert into $i\hbar\,\partial_t|\psi\rangle = \hat H|\psi\rangle$. The $\hat H_0$ terms cancel against the derivative of the phases, leaving
$$i\hbar \sum_n \dot c_n e^{-iE_nt/\hbar}|n\rangle = \lambda\sum_n c_n e^{-iE_nt/\hbar}\hat H'|n\rangle .$$

Project onto $\langle f|$ and use $\omega_{fn} \equiv (E_f - E_n)/\hbar$:
$$\boxed{\ i\hbar\,\dot c_f = \lambda\sum_n H'_{fn}(t)\,e^{i\omega_{fn}t}\,c_n\ }\qquad H'_{fn}\equiv\langle f|\hat H'|n\rangle .$$

This is **exact**. Now perturb: with the system in $|i\rangle$ at $t=0$, set $c_n(0)=\delta_{ni}$ and keep only the $n=i$ term on the right (zeroth order) to get the first-order amplitude:
$$\boxed{\ c_f^{(1)}(t) = \frac{1}{i\hbar}\int_0^t H'_{fi}(t')\,e^{i\omega_{fi}t'}\,dt'\ ,\qquad f\ne i.}$$

*Note the structure:* **the first-order amplitude is the Fourier component of the perturbation at the Bohr frequency $\omega_{fi}$.** Every result in this question follows from that one sentence, and it is worth writing it explicitly in the answer booklet.

### (b) Constant perturbation → Golden Rule

For $H'_{fi}$ independent of $t$ (switched on at $t=0$):
$$c_f^{(1)} = \frac{H'_{fi}}{i\hbar}\int_0^t e^{i\omega_{fi}t'}dt' = \frac{H'_{fi}}{i\hbar}\cdot\frac{e^{i\omega_{fi}t}-1}{i\omega_{fi}} = -\frac{H'_{fi}}{\hbar}\,e^{i\omega_{fi}t/2}\,\frac{2\sin(\omega_{fi}t/2)}{\omega_{fi}} .$$

Hence
$$\boxed{\ P_{i\to f}(t) = |c_f^{(1)}|^2 = \frac{|H'_{fi}|^2}{\hbar^2}\cdot\frac{4\sin^2(\omega_{fi}t/2)}{\omega_{fi}^2}\ }$$

Sketch this against $\omega_{fi}$: a tall central peak of height $|H'_{fi}|^2t^2/\hbar^2$ and width $\Delta\omega \sim 2\pi/t$, with small side lobes. Two immediate physical readings, both worth marks:

- The probability grows as $t^2$ **on resonance** but the peak *narrows* as $1/t$ — this is the energy–time uncertainty relation $\Delta E\,\Delta t\sim\hbar$ appearing automatically. A transition is only "energy-conserving" to within $\hbar/t$.
- Off resonance the probability merely oscillates; no net transition accumulates.

Now suppose the final states form a **continuum** with density of states $\rho(E_f)$. The total transition probability is
$$P = \int \frac{|H'_{fi}|^2}{\hbar^2}\,\frac{4\sin^2(\omega_{fi}t/2)}{\omega_{fi}^2}\,\rho(E_f)\,dE_f .$$

Use the standard limit, which follows from $\displaystyle\int_{-\infty}^{\infty}\frac{4\sin^2(\omega t/2)}{\omega^2}d\omega = 2\pi t$:
$$\frac{4\sin^2(\omega_{fi}t/2)}{\omega_{fi}^2}\ \xrightarrow{\ t\ \text{large}\ }\ 2\pi t\,\delta(\omega_{fi}) = 2\pi t\,\hbar\,\delta(E_f-E_i).$$

Assuming $|H'_{fi}|^2\rho(E_f)$ varies slowly across the narrow peak and pulling it out at $E_f = E_i$:
$$P = \frac{2\pi t}{\hbar}\,|H'_{fi}|^2\,\rho(E_f)\Big|_{E_f=E_i}.$$

The probability is now **linear in $t$**, so a constant *rate* exists:
$$\boxed{\ W_{i\to f} = \frac{dP}{dt} = \frac{2\pi}{\hbar}\,\big|H'_{fi}\big|^2\,\rho(E_f)\ }\qquad\text{(Fermi's Golden Rule).}$$

The transition from $t^2$ (single final state, coherent) to $t$ (continuum, incoherent) is the whole content of the golden rule — say so explicitly.

### (c) Harmonic perturbation

Take $\hat H'(t) = \hat V e^{-i\omega t} + \hat V^\dagger e^{+i\omega t}$. Then
$$c_f^{(1)} = \frac{1}{i\hbar}\int_0^t\left[V_{fi}e^{i(\omega_{fi}-\omega)t'} + (V^\dagger)_{fi}e^{i(\omega_{fi}+\omega)t'}\right]dt' .$$

The two terms peak at $\omega_{fi}=+\omega$ and $\omega_{fi}=-\omega$ respectively, i.e. at $E_f = E_i + \hbar\omega$ (**absorption**) and $E_f = E_i - \hbar\omega$ (**stimulated emission**). Near a resonance only one term is large (rotating-wave approximation), and repeating the argument of part (b):
$$\boxed{\ W_{i\to f} = \frac{2\pi}{\hbar}\big|V_{fi}\big|^2\,\delta(E_f - E_i \mp \hbar\omega)\ }$$

Since $|V_{fi}| = |V_{if}|$, the absorption and stimulated-emission rates are **equal** — which is exactly Einstein's $B_{12}=B_{21}$, derived thermodynamically in the `2026-07-21` optics set. Point this cross-link out in the answer; it is the kind of synthesis that separates a 12 from an 18.

For an atom in a monochromatic field in the **dipole approximation**, $\hat V = -e\,\mathbf E_0\cdot\hat{\mathbf r}/2$, so $W \propto |\langle f|\hat{\mathbf r}|i\rangle|^2$, and the vanishing of that matrix element gives the **selection rules** $\Delta\ell=\pm1$, $\Delta m = 0,\pm1$.

### (d) Validity

First order requires $|c_f^{(1)}| \ll 1$, i.e. $|H'_{fi}|\,t \ll \hbar$ for short times, or more usefully $|H'_{fi}| \ll |E_f - E_i|$. The golden rule additionally requires $t$ long enough that $\hbar/t$ is small compared with the scale over which $\rho(E)|H'|^2$ varies, but short enough that $P\ll1$ — i.e. an intermediate time window. Both conditions should be stated.

---

## P2 — Sudden approximation: tritium beta decay

### Statement and validity

If the Hamiltonian changes from $\hat H_{\text{old}}$ to $\hat H_{\text{new}}$ over a time $\tau$ that is **short compared with the natural periods** of the system ($\tau \ll \hbar/\Delta E$, equivalently $\tau \ll$ orbital period), the state vector has no time to evolve and is **unchanged** across the switch. The subsequent physics is obtained by re-expanding the *old* state in the *new* eigenbasis:
$$\boxed{\ P_{i\to f} = \big|\langle\phi_f^{\text{new}}\,\big|\,\psi_i^{\text{old}}\rangle\big|^2\ }$$

This is the exact opposite limit to the **adiabatic** theorem ($\tau \gg \hbar/\Delta E$), where the system stays in the *corresponding* instantaneous eigenstate. Contrasting the two limits in one sentence is usually worth a mark.

### (a) Why it applies

The beta electron leaves with kinetic energy of order 10 keV, so $v_\beta \sim \sqrt{2E/m} \approx 6\times10^7\ \mathrm{m\,s^{-1}}$, and it crosses the atomic radius $a_0 \approx 0.53\ \text{Å}$ in
$$\tau \sim \frac{a_0}{v_\beta} \approx \frac{5.3\times10^{-11}}{6\times10^{7}} \approx 10^{-18}\ \text{s}.$$
The orbital period of the 1s electron is $T \sim 2\pi a_0/(\alpha c) \approx 1.5\times10^{-16}$ s. Since $\tau/T \sim 10^{-2} \ll 1$, the change in nuclear charge is effectively instantaneous. ✔

### (b) The overlap

Before: the electron is in the hydrogenic 1s state with $Z_1 = 1$. After: the eigenstates are those of He$^+$, $Z_2 = 2$. With
$$\psi_{100}^{(Z)}(r) = \frac{1}{\sqrt\pi}\left(\frac{Z}{a_0}\right)^{3/2} e^{-Zr/a_0},$$
the overlap is
$$S = \langle \psi^{(Z_2)}_{100}|\psi^{(Z_1)}_{100}\rangle = \frac{1}{\pi}\frac{(Z_1Z_2)^{3/2}}{a_0^3}\int_0^\infty e^{-(Z_1+Z_2)r/a_0}\,4\pi r^2\,dr .$$

Using $\int_0^\infty r^2 e^{-\beta r}dr = 2/\beta^3$ with $\beta = (Z_1+Z_2)/a_0$:
$$S = \frac{4(Z_1Z_2)^{3/2}}{a_0^3}\cdot\frac{2a_0^3}{(Z_1+Z_2)^3} \;=\; \boxed{\ \frac{8\,(Z_1Z_2)^{3/2}}{(Z_1+Z_2)^3}\ }$$

(Memorise this closed form — it recurs whenever UPSC changes a nuclear charge suddenly.) For $Z_1=1,\ Z_2=2$:
$$S = \frac{8\cdot 2^{3/2}}{27} = \frac{8\times 2.8284}{27} = 0.8381 .$$

$$\boxed{\ P_{1s} = |S|^2 = 0.702\ \ (70.2\%)\ }$$

### (c) Everything else

$$P(\text{excited or ionised}) = 1 - 0.702 = \boxed{0.298\ \ (\approx 30\%)}.$$

Note that by parity/orthogonality the electron can only land in $\ell=0$ states of He$^+$ (the initial state is spherically symmetric and the transformation is purely radial), so the residual 30% is distributed over the $2s, 3s, \dots$ levels and the $\ell=0$ continuum. Stating that selection-rule remark earns marks.

---

## P3 — The variational method

### (a) Proof

Expand an arbitrary normalised $|\psi\rangle$ in the exact eigenbasis, $|\psi\rangle = \sum_n c_n|n\rangle$ with $\sum|c_n|^2=1$. Then
$$\langle \hat H\rangle = \sum_n |c_n|^2 E_n \ \ge\ \sum_n |c_n|^2 E_0 = E_0 ,$$
since $E_n \ge E_0$ for all $n$. Equality holds iff $|\psi\rangle = |0\rangle$. $\blacksquare$

**The strategy:** choose a family $\psi_\alpha$ with parameter(s) $\alpha$, compute $E(\alpha)=\langle\psi_\alpha|\hat H|\psi_\alpha\rangle$, and minimise. The minimum is a rigorous **upper bound** on $E_0$. Always say "upper bound" — UPSC marks it.

### (b) Gaussian trial function for hydrogen

Work in Gaussian units ($e^2 \equiv e^2/4\pi\varepsilon_0$). Take $\psi = Ae^{-\alpha r^2}$.

**Normalisation.** $\displaystyle |A|^2\int_0^\infty e^{-2\alpha r^2}4\pi r^2 dr = 1$. With $\int_0^\infty r^2 e^{-br^2}dr = \tfrac14\sqrt{\pi/b^3}$ and $b=2\alpha$:
$$|A|^2\,\pi\sqrt{\frac{\pi}{8\alpha^3}} = 1 \ \Longrightarrow\ \boxed{|A|^2 = \left(\frac{2\alpha}{\pi}\right)^{3/2}} .$$

**Kinetic energy.** $\nabla\psi = -2\alpha r\,\psi\,\hat r$, so $|\nabla\psi|^2 = 4\alpha^2r^2|\psi|^2$ and
$$\langle T\rangle = \frac{\hbar^2}{2m}\int|\nabla\psi|^2 d^3r = \frac{\hbar^2}{2m}\,4\alpha^2\langle r^2\rangle .$$
With $\int_0^\infty r^4e^{-br^2}dr = \tfrac38\sqrt{\pi/b^5}$ one finds $\langle r^2\rangle = \dfrac{3}{4\alpha}$, hence
$$\langle T\rangle = \frac{\hbar^2}{2m}\cdot4\alpha^2\cdot\frac{3}{4\alpha} = \frac{3\hbar^2\alpha}{2m}.$$

**Potential energy.** $\langle 1/r\rangle = |A|^2\,4\pi\int_0^\infty r e^{-2\alpha r^2}dr = |A|^2\,4\pi\cdot\frac{1}{4\alpha} = \frac{\pi|A|^2}{\alpha}$, so
$$\langle V\rangle = -e^2\frac{\pi}{\alpha}\left(\frac{2\alpha}{\pi}\right)^{3/2} = -2e^2\sqrt{\frac{2\alpha}{\pi}} .$$

**Minimise.**
$$E(\alpha) = \frac{3\hbar^2\alpha}{2m} - 2e^2\sqrt{\frac{2}{\pi}}\,\sqrt\alpha,\qquad \frac{dE}{d\alpha} = \frac{3\hbar^2}{2m} - \frac{e^2}{\sqrt\alpha}\sqrt{\frac{2}{\pi}} = 0 .$$
$$\Longrightarrow\ \sqrt{\alpha_{\min}} = \frac{2me^2}{3\hbar^2}\sqrt{\frac{2}{\pi}},\qquad \boxed{\alpha_{\min} = \frac{8m^2e^4}{9\pi\hbar^4}} .$$

At the minimum the stationarity condition gives $2e^2\sqrt{2/\pi}\,\sqrt\alpha = 3\hbar^2\alpha/m$, so the two terms combine neatly:
$$E_{\min} = \frac{3\hbar^2\alpha}{2m} - \frac{3\hbar^2\alpha}{m} = -\frac{3\hbar^2\alpha_{\min}}{2m} = -\frac{4}{3\pi}\frac{me^4}{\hbar^2} .$$

Writing $\dfrac{me^4}{2\hbar^2} = 13.6$ eV:
$$\boxed{\ E_{\min} = -\frac{8}{3\pi}\left(\frac{me^4}{2\hbar^2}\right) = -0.8488\times13.6\ \text{eV} = -11.5\ \text{eV}\ }$$

**Comment.** The bound is above the exact $-13.6$ eV, as the theorem guarantees, and the error is $15\%$. Note also the **virial check**: $\langle T\rangle = -\tfrac12\langle V\rangle$ at the optimum, exactly as required for a $1/r$ potential — a free consistency test you should always run. The Gaussian is a genuinely *bad* trial function here: it has zero slope at the origin (no cusp) and falls off as $e^{-\alpha r^2}$ instead of $e^{-r/a_0}$, wrong at both ends. It still gets the energy to 15%.

### (c) Why energies are good and other observables are not

Write $\psi = \psi_0 + \epsilon\,\delta\psi$ with $\delta\psi \perp \psi_0$. Then
$$\langle\hat H\rangle = E_0 + \mathcal{O}(\epsilon^2),$$
because the first-order term $2\epsilon\,\mathrm{Re}\langle\psi_0|\hat H|\delta\psi\rangle = 2\epsilon E_0\,\mathrm{Re}\langle\psi_0|\delta\psi\rangle = 0$. **The energy is stationary about the true ground state**, so a wavefunction error $\epsilon$ produces only an $\epsilon^2$ energy error.

For any *other* operator $\hat A$ there is no such stationarity: $\langle\hat A\rangle = \langle\hat A\rangle_0 + \mathcal{O}(\epsilon)$, first order in the error. Hence the Gaussian gives $E$ to 15% but $\langle r\rangle$, $\langle 1/r^3\rangle$ (which controls fine structure) and the cusp density $|\psi(0)|^2$ (which controls the hyperfine splitting) badly wrong. **Never quote a variational wavefunction for anything but the energy** — a one-line remark that reliably earns a mark.

---

## P4 — WKB approximation

### (a) Derivation

Substitute $\psi(x) = \exp\!\left[\dfrac{i}{\hbar}S(x)\right]$ into $-\dfrac{\hbar^2}{2m}\psi'' + V\psi = E\psi$. Since $\psi'' = \left[\dfrac{i}{\hbar}S'' - \dfrac{1}{\hbar^2}(S')^2\right]\psi$,
$$\boxed{\ (S')^2 - i\hbar S'' = p^2(x),\qquad p(x)\equiv\sqrt{2m\big(E-V(x)\big)}\ }$$
This is exact (the Riccati form). Now expand $S = S_0 + \hbar S_1 + \hbar^2 S_2 + \cdots$ and match powers:

- $\mathcal{O}(\hbar^0)$: $(S_0')^2 = p^2 \Rightarrow S_0 = \pm\int p\,dx$ — the classical action; this is the classical limit.
- $\mathcal{O}(\hbar^1)$: $2S_0'S_1' - iS_0'' = 0 \Rightarrow S_1' = \dfrac{i}{2}\dfrac{S_0''}{S_0'} \Rightarrow S_1 = \dfrac{i}{2}\ln p$.

Hence $\psi \simeq \exp\!\left[\pm\frac{i}{\hbar}\int p\,dx\right]\cdot e^{-\frac12\ln p}$:
$$\boxed{\ \psi(x) \simeq \frac{C_\pm}{\sqrt{p(x)}}\exp\!\left[\pm\frac{i}{\hbar}\int^x p(x')dx'\right]\ }\quad (E>V,\ \text{allowed})$$
$$\psi(x) \simeq \frac{D_\pm}{\sqrt{|p(x)|}}\exp\!\left[\pm\frac{1}{\hbar}\int^x |p(x')|dx'\right]\quad (E<V,\ \text{forbidden}).$$

The $1/\sqrt p$ prefactor has a clean physical meaning worth stating: $|\psi|^2 \propto 1/p \propto 1/v$, i.e. **the particle is most likely to be found where it moves slowest** — the classical probability density.

**Validity.** The expansion needs $|\hbar S''| \ll |(S')^2|$, i.e.
$$\boxed{\ \left|\frac{d\bar\lambda}{dx}\right|\ll1 \iff \frac{m\hbar\,|dV/dx|}{p^3}\ll1\ },\qquad \bar\lambda(x)\equiv\frac{\hbar}{p(x)}$$
— the potential must change little over a de Broglie wavelength. This **fails wherever $p\to0$**, i.e. at every classical turning point, where the WKB form diverges.

### (b) Connection formulae and quantisation

Near a turning point $x_2$ (with the allowed region to its left) linearise $V(x)-E \approx V'(x_2)(x-x_2)$. The Schrödinger equation becomes the **Airy equation**, whose solution $\mathrm{Ai}(z)$ is finite everywhere; matching its known asymptotic forms onto the WKB solutions on either side gives the connection formulae:
$$\frac{2}{\sqrt p}\cos\!\left[\frac1\hbar\int_x^{x_2}p\,dx - \frac\pi4\right] \longleftrightarrow \frac{1}{\sqrt{|p|}}\exp\!\left[-\frac1\hbar\int_{x_2}^{x}|p|\,dx\right] ,$$
and the mirror image at the left turning point $x_1$. **The $-\pi/4$ is the entire content of the connection problem** — it is the phase loss on reflection at a smooth turning point.

For a well with turning points $x_1 < x_2$, the wavefunction must be simultaneously representable from both sides. From the right-hand connection, in the allowed region
$$\psi \propto \frac{1}{\sqrt p}\cos\!\left[\frac1\hbar\int_x^{x_2}p\,dx - \frac\pi4\right];$$
from the left-hand one,
$$\psi \propto \frac{1}{\sqrt p}\cos\!\left[\frac1\hbar\int_{x_1}^{x}p\,dx - \frac\pi4\right].$$
These agree (up to sign) only if the two phases sum to $n\pi$:
$$\frac1\hbar\int_{x_1}^{x_2}p\,dx - \frac\pi2 = n\pi ,$$
$$\boxed{\ \int_{x_1}^{x_2}p(x)\,dx = \left(n+\tfrac12\right)\pi\hbar\quad\text{or}\quad \oint p\,dx = \left(n+\tfrac12\right)h,\qquad n=0,1,2,\dots}$$

The $\tfrac12$ is $\tfrac14 + \tfrac14$, one quarter from each smooth turning point — hence the variants: **two smooth turning points → $(n+\tfrac12)$; one rigid wall + one turning point → $(n+\tfrac34)$; two rigid walls → $(n+1)$**, which reproduces the infinite square well exactly. Quoting all three cases is the mark-scoring move.

### (c) Harmonic oscillator — WKB is exact

$V=\tfrac12m\omega^2x^2$, turning points at $x_{1,2}=\mp a$, $a=\sqrt{2E/m\omega^2}$.
$$\int_{-a}^{a}\sqrt{2m\left(E-\tfrac12m\omega^2x^2\right)}\,dx = \sqrt{2mE}\int_{-a}^{a}\sqrt{1-\frac{x^2}{a^2}}\,dx = \sqrt{2mE}\cdot\frac{\pi a}{2} .$$
Substituting $a$: $\sqrt{2mE}\cdot\frac{\pi}{2}\sqrt{\frac{2E}{m\omega^2}} = \frac{\pi E}{\omega}$. Setting this equal to $(n+\tfrac12)\pi\hbar$:
$$\boxed{\ E_n = \left(n+\tfrac12\right)\hbar\omega\ }$$
— the **exact** spectrum, zero-point energy included. (This is not an accident: WKB is exact for the oscillator to all orders because the higher $S_k$ integrate to zero around the closed orbit.)

### (d) The linear potential $V=F|x|$

Turning points at $x=\pm a$ with $a = E/F$. The potential has a kink at the origin, but that lies in the *allowed* region, so the $(n+\tfrac12)$ rule stands.
$$\int_{-a}^{a}\sqrt{2m(E-F|x|)}\,dx = 2\sqrt{2m}\int_0^a\sqrt{E-Fx}\,dx = 2\sqrt{2m}\cdot\frac{2}{3}\frac{E^{3/2}}{F} = \frac{4\sqrt{2m}\,E^{3/2}}{3F} .$$
Equating to $(n+\tfrac12)\pi\hbar$:
$$\boxed{\ E_n = \left[\frac{3\pi\hbar F\left(n+\tfrac12\right)}{4\sqrt{2m}}\right]^{2/3} = \left(\frac{\hbar^2F^2}{2m}\right)^{1/3}\left[\frac{3\pi}{4}\left(n+\tfrac12\right)\right]^{2/3}}$$

The exact answer involves zeros of the Airy function ($E_n$ set by zeros of $\mathrm{Ai}'$ for even states and of $\mathrm{Ai}$ for odd states, in units of $(\hbar^2F^2/2m)^{1/3}$). Checked against those: WKB overestimates the ground state by about **9%**, but every excited level is right to better than **0.8%**, and the error falls steadily with $n$ — the expected behaviour, since WKB is a semi-classical expansion in $1/n$. If a question asks you to "comment on the accuracy", that is the comment: *good for high $n$, poor for the ground state.* **Variant to expect:** the *bouncing ball*, $V=mgx$ for $x>0$ with a hard floor at $x=0$ — same integral over $[0,a]$ only, but with the $(n+\tfrac34)$ rule.

---

## P5 — WKB tunnelling and alpha decay

### (a) Transmission coefficient

In the forbidden region $x_1<x<x_2$ the decaying WKB solution is $\psi \propto |p|^{-1/2}\exp\left[-\frac1\hbar\int|p|dx\right]$. The amplitude is attenuated by the factor $e^{-\gamma}$ across the barrier, so the *probability* transmission is
$$\boxed{\ T \simeq e^{-2\gamma},\qquad \gamma = \frac1\hbar\int_{x_1}^{x_2}\sqrt{2m\big(V(x)-E\big)}\,dx\ }$$
valid for a thick, opaque barrier ($\gamma\gg1$), where the prefactor (which is $\approx[1+\tfrac14e^{2\gamma}]^{-1}\cdot$corrections) is irrelevant beside the exponential.

### (b) The Gamow factor

Model: inside $r<R$ the $\alpha$ is bound in the nuclear well and rattles against the wall; outside, it sees the Coulomb repulsion of the **daughter** nucleus,
$$V(r) = \frac{2Z'e^2}{4\pi\varepsilon_0\,r},$$
where $2e$ is the alpha charge and $Z'e$ the daughter charge. The outer turning point is where $V=E$:
$$b = \frac{2Z'e^2}{4\pi\varepsilon_0 E}.$$

$$\gamma = \frac{\sqrt{2m}}{\hbar}\int_R^b\sqrt{\frac{2Z'e^2}{4\pi\varepsilon_0 r}-E}\;dr = \frac{\sqrt{2mE}}{\hbar}\int_R^b\sqrt{\frac{b}{r}-1}\;dr .$$

The standard integral is
$$\int_R^b\sqrt{\frac br - 1}\,dr = b\left[\cos^{-1}\sqrt{x} - \sqrt{x(1-x)}\right],\qquad x\equiv\frac Rb ,$$
(obtained with $r = b\cos^2\theta$). Hence
$$\boxed{\ 2\gamma = \frac{2b\sqrt{2mE}}{\hbar}\left[\cos^{-1}\sqrt{x}-\sqrt{x(1-x)}\right]\ }$$

**Point-nucleus limit.** For $R\ll b$, $\cos^{-1}\sqrt x - \sqrt{x(1-x)} \to \frac\pi2 - 2\sqrt x$. Keeping the leading term and using $v=\sqrt{2E/m}$ so that $\sqrt{2m/E}=2/v$:
$$2\gamma \to \frac{2b\sqrt{2mE}}{\hbar}\cdot\frac\pi2 = \frac{\pi\,\sqrt{2m/E}\;2Z'e^2}{4\pi\varepsilon_0\hbar} = \boxed{\ \frac{2\pi\,(2Z')e^2}{4\pi\varepsilon_0\,\hbar v}\ }$$
which is $2\pi Z_1Z_2 e^2/4\pi\varepsilon_0\hbar v$ — the **Gamow factor** in its familiar form. Note it is $\propto 1/v \propto E^{-1/2}$.

**Geiger–Nuttall.** The decay constant is (frequency of assaults on the barrier) $\times$ (penetrability):
$$\lambda = f\,T = f\,e^{-2\gamma},\qquad f \approx \frac{v_{\text{in}}}{2R}\sim10^{21}\ \text{s}^{-1}.$$
$$\ln\lambda = \ln f - \frac{2\pi(2Z')e^2}{4\pi\varepsilon_0\hbar}\sqrt{\frac{m}{2E}} \;\equiv\; \boxed{\ a - \frac{b'}{\sqrt E}\ }$$
This is the **Geiger–Nuttall law**, and its explanation was Gamow's triumph: the *enormous* spread of alpha half-lives (from $10^{-7}$ s to $10^{17}$ y — 24 orders of magnitude) for alpha energies varying by a mere factor of 2, because $E$ sits in an exponent under a square root.

### (c) Numerical: $^{238}\mathrm{U}\to{}^{234}\mathrm{Th}+\alpha$

Use $e^2/4\pi\varepsilon_0 = 1.440$ MeV·fm, $\hbar c = 197.3$ MeV·fm, $m_\alpha c^2 = 3727.4$ MeV, $E=4.27$ MeV, $Z'=90$.

**Outer turning point:**
$$b = \frac{2\times90\times1.440}{4.27}\ \text{fm} = \frac{259.2}{4.27} = 60.7\ \text{fm}.$$

**Nuclear radius:** $R = 1.2\left(234^{1/3}+4^{1/3}\right) = 1.2\,(6.162+1.587) = 9.30$ fm. Hence $x = R/b = 0.1532$.

**Bracket:** $\cos^{-1}\sqrt{0.1532} = \cos^{-1}(0.3914) = 1.1683$ rad; $\sqrt{x(1-x)} = \sqrt{0.1532\times0.8468}=0.3602$. Bracket $= 0.8081$.

**Prefactor:** $\dfrac{2b\sqrt{2m_\alpha E}}{\hbar} = \dfrac{2b\sqrt{2m_\alpha c^2 E}}{\hbar c} = \dfrac{2\times60.7\times\sqrt{2\times3727.4\times4.27}}{197.3} = \dfrac{121.4\times178.4}{197.3} = 109.8 .$

$$\boxed{\ 2\gamma = 109.8\times0.8081 = 88.7\quad\Longrightarrow\quad T = e^{-88.7} \approx 3\times10^{-39}\ }$$

**Comment.** The barrier is opaque to one part in $10^{39}$. With an assault frequency $f\sim10^{21}\ \mathrm{s^{-1}}$ this gives $\lambda \sim 3\times10^{-18}\ \mathrm{s^{-1}}$, i.e. $t_{1/2}=\ln2/\lambda \sim 2\times10^{17}$ s $\sim 7\times10^{9}$ y — the right order for the measured $4.5\times10^{9}$ y, from a one-line model. Note also how much the **finite nuclear radius matters**: the point-nucleus formula would give $2\gamma = 172$ (bracket $\pi/2$ instead of $0.808$), i.e. $T$ too small by $10^{36}$. Always keep the full $\cos^{-1}$ expression when a numerical value of $R$ is supplied — dropping it is the single most common error in this question.

---

## P6 — Partial-wave analysis

### (a) Set-up

For a beam of wavenumber $k$ ($E=\hbar^2k^2/2m$) incident on a finite-range central potential $V(r)$, the stationary scattering state has the asymptotic form
$$\psi(\mathbf r) \xrightarrow{r\to\infty} e^{ikz} + f(\theta)\,\frac{e^{ikr}}{r} .$$

The incident probability current is $j_{\text{inc}} = \hbar k/m$; the scattered current through $r^2d\Omega$ is $(\hbar k/m)|f|^2 d\Omega$. Dividing,
$$\boxed{\ \frac{d\sigma}{d\Omega} = |f(\theta)|^2\ }$$
For a central potential there is no $\phi$-dependence, so we may expand in Legendre polynomials.

### (b) Partial waves and phase shifts

Write $\psi = \sum_\ell R_\ell(r)P_\ell(\cos\theta)$ and use $u_\ell = rR_\ell$, which satisfies the radial equation with the centrifugal term. Beyond the range of $V$, the free solutions give
$$u_\ell(r)\ \xrightarrow{r\to\infty}\ C_\ell\,\sin\!\left(kr - \frac{\ell\pi}{2} + \delta_\ell\right),$$
so **all a short-range potential can do to a partial wave is shift its asymptotic phase by $\delta_\ell$** — say this in words, it is the physical heart of the method.

Expand the plane wave using the Rayleigh formula, $e^{ikz} = \sum_\ell (2\ell+1)i^\ell j_\ell(kr)P_\ell$, with $j_\ell(kr)\to \sin(kr-\ell\pi/2)/kr$, i.e. a superposition of incoming and outgoing spherical waves. Comparing the coefficients of $e^{ikr}/r$ and $e^{-ikr}/r$ in $\psi$ and in $e^{ikz}+f e^{ikr}/r$:

- the **incoming** parts must be identical (the potential cannot create incoming flux);
- the **outgoing** part acquires the factor $S_\ell = e^{2i\delta_\ell}$, which has $|S_\ell|=1$ — this is **unitarity**, i.e. conservation of probability for elastic scattering.

Collecting the outgoing terms:
$$\boxed{\ f(\theta) = \frac{1}{2ik}\sum_{\ell=0}^{\infty}(2\ell+1)\left(e^{2i\delta_\ell}-1\right)P_\ell(\cos\theta) = \frac1k\sum_\ell(2\ell+1)e^{i\delta_\ell}\sin\delta_\ell\,P_\ell(\cos\theta)}$$

Using orthogonality $\int P_\ell P_{\ell'}d\Omega = \frac{4\pi}{2\ell+1}\delta_{\ell\ell'}$ the cross terms drop out of $\int|f|^2d\Omega$:
$$\boxed{\ \sigma_{\text{tot}} = \frac{4\pi}{k^2}\sum_\ell (2\ell+1)\sin^2\delta_\ell\ }$$
The **unitarity bound** follows at once: $\sigma_\ell \le 4\pi(2\ell+1)/k^2$, saturated at $\delta_\ell = \pi/2$ — which is exactly what happens on **resonance**.

### (c) Optical theorem

Set $\theta=0$, where $P_\ell(1)=1$:
$$f(0) = \frac1k\sum_\ell(2\ell+1)e^{i\delta_\ell}\sin\delta_\ell \ \Longrightarrow\ \mathrm{Im}\,f(0) = \frac1k\sum_\ell(2\ell+1)\sin^2\delta_\ell .$$
Comparing with $\sigma_{\text{tot}}$ above:
$$\boxed{\ \sigma_{\text{tot}} = \frac{4\pi}{k}\,\mathrm{Im}\,f(0)\ }$$

**Physical content:** flux removed from the forward beam must reappear as scattered flux, and removal happens by *destructive interference* between the incident wave and the forward-scattered wave. It is a statement of probability conservation, and it holds with $\sigma_{\text{tot}} = \sigma_{\text{el}}+\sigma_{\text{inel}}$ even when absorption is present ($|S_\ell|<1$) — worth adding.

### (d) Hard sphere

$V=\infty$ for $r<a$, $0$ outside. The boundary condition is $u_\ell(a)=0$.

For $\ell=0$, outside the sphere $u_0 = C\sin(kr+\delta_0)$, so $\sin(ka+\delta_0)=0$:
$$\boxed{\ \delta_0 = -ka\ }$$
(the minus sign signals a **repulsive** potential — the wave is pushed *out*, its phase retarded).

$$\sigma_0 = \frac{4\pi}{k^2}\sin^2(ka).$$

**Low energy ($ka\ll1$):** $\sin^2(ka)\to k^2a^2$, so
$$\boxed{\ \sigma \to 4\pi a^2\ }$$
— **four times** the geometric cross-section $\pi a^2$, and equal to the *total surface area* of the sphere. The scattering is isotropic (pure s-wave) and the classical shadow picture fails completely; this is a purely wave-diffraction result, and UPSC likes the "explain the factor 4" follow-up.

**High energy ($ka\gg1$):** all waves up to $\ell_{\max}\approx ka$ contribute with $\delta_\ell$ effectively random, $\langle\sin^2\delta_\ell\rangle=\tfrac12$:
$$\sigma \approx \frac{4\pi}{k^2}\sum_{\ell=0}^{ka}(2\ell+1)\cdot\frac12 \approx \frac{4\pi}{k^2}\cdot\frac{(ka)^2}{2} = 2\pi a^2 ,$$
i.e. **twice** the geometric value — the classical $\pi a^2$ plus an equal shadow-diffraction contribution (this is the "extinction paradox", and it is exactly what the optical theorem requires).

**Scattering length.** Defined by
$$a_s = -\lim_{k\to0}\frac{\tan\delta_0}{k}\quad\Longrightarrow\quad \sigma_{k\to0}=4\pi a_s^2 .$$
For the hard sphere $\tan\delta_0 = \tan(-ka)\to -ka$, so $\boxed{a_s = a}$ — the scattering length *is* the sphere radius. Geometrically, $a_s$ is the intercept of the asymptotic zero-energy wavefunction $u_0 \propto (r-a_s)$ on the $r$-axis; $a_s>0$ means effective repulsion, $a_s<0$ effective attraction, and $a_s\to\infty$ signals a bound state at threshold (the neutron–proton triplet case, $a_t = +5.4$ fm, reflecting the deuteron).

### (e) Why only $\ell \lesssim ka$

Classically, a particle of momentum $\hbar k$ with impact parameter $b$ has angular momentum $L=\hbar kb$, i.e. $\ell = kb$. Only particles with $b <$ range $a$ feel the potential, hence only $\ell < ka$ are affected. Quantum-mechanically the same follows from the centrifugal barrier: $j_\ell(kr)\sim(kr)^\ell$ for small argument, so higher partial waves have vanishing amplitude inside $r<a$ when $ka\ll1$.

**Consequence worth stating:** at low energy **only s-wave scattering survives**, scattering is isotropic, and one number — the scattering length — describes everything. That is why low-energy nuclear and cold-atom physics is parameterised by $a_s$.

---

## P7 — Born approximation

### (a) Derivation

Write the Schrödinger equation as $(\nabla^2+k^2)\psi = \dfrac{2m}{\hbar^2}V\psi \equiv Q$. Using the outgoing Green's function of the Helmholtz operator, $G(\mathbf r-\mathbf r') = -\dfrac{e^{ik|\mathbf r-\mathbf r'|}}{4\pi|\mathbf r-\mathbf r'|}$, the solution with the correct boundary condition is the **Lippmann–Schwinger equation**
$$\psi(\mathbf r) = e^{i\mathbf k_i\cdot\mathbf r} - \frac{m}{2\pi\hbar^2}\int \frac{e^{ik|\mathbf r-\mathbf r'|}}{|\mathbf r-\mathbf r'|}\,V(\mathbf r')\,\psi(\mathbf r')\,d^3r' .$$

For $r\gg r'$, $|\mathbf r-\mathbf r'| \approx r - \hat r\cdot\mathbf r'$, so $e^{ik|\mathbf r-\mathbf r'|}/|\mathbf r-\mathbf r'| \to (e^{ikr}/r)\,e^{-i\mathbf k_f\cdot\mathbf r'}$ with $\mathbf k_f = k\hat r$. Comparing with $\psi\to e^{ikz}+f e^{ikr}/r$:
$$f(\theta) = -\frac{m}{2\pi\hbar^2}\int e^{-i\mathbf k_f\cdot\mathbf r'}V(\mathbf r')\psi(\mathbf r')\,d^3r' .$$

This is exact but implicit. The **first Born approximation** replaces $\psi$ inside the integral by the *undistorted* incident wave, $\psi(\mathbf r')\approx e^{i\mathbf k_i\cdot\mathbf r'}$:
$$\boxed{\ f_B(\mathbf q) = -\frac{m}{2\pi\hbar^2}\int e^{i\mathbf q\cdot\mathbf r}V(\mathbf r)\,d^3r,\qquad \mathbf q=\mathbf k_i-\mathbf k_f,\ q=2k\sin(\theta/2)\ }$$

**In one sentence: the Born amplitude is the Fourier transform of the potential at the momentum transfer.** (Which is why electron/neutron scattering *measures* the Fourier transform of charge and density distributions — the form factor. Say this; it links directly to nuclear-size determination in Paper II's nuclear section.)

For a **central** potential, do the angular integral with $\mathbf q\cdot\mathbf r = qr\cos\alpha$:
$$\int e^{i\mathbf q\cdot\mathbf r}V(r)d^3r = 2\pi\int_0^\infty r^2V(r)\int_{-1}^{1}e^{iqr\mu}d\mu\,dr = \frac{4\pi}{q}\int_0^\infty rV(r)\sin(qr)\,dr ,$$
$$\boxed{\ f_B(q) = -\frac{2m}{\hbar^2 q}\int_0^\infty r\,V(r)\,\sin(qr)\,dr\ }$$

### (b) Yukawa (screened Coulomb)

$V(r) = V_0\dfrac{e^{-\mu r}}{r}$, so $rV(r) = V_0e^{-\mu r}$ and
$$\int_0^\infty e^{-\mu r}\sin(qr)\,dr = \frac{q}{\mu^2+q^2} .$$
$$\boxed{\ f_B(q) = -\frac{2mV_0}{\hbar^2}\cdot\frac{1}{\mu^2+q^2},\qquad \frac{d\sigma}{d\Omega} = \left[\frac{2mV_0}{\hbar^2(\mu^2+q^2)}\right]^2 }$$

The screening length $\mu^{-1}$ cuts off the forward divergence: $d\sigma/d\Omega$ is finite at $\theta=0$, and the total cross-section is finite. Physically, at small $q$ (large impact parameter) the projectile sees a *neutralised* charge.

### (c) Rutherford limit

Let $\mu\to0$ and $V_0 \to Z_1Z_2e^2/4\pi\varepsilon_0$. With $q = 2k\sin(\theta/2)$ and $\hbar^2k^2 = 2mE$:
$$f_B = -\frac{2m}{\hbar^2}\frac{Z_1Z_2e^2/4\pi\varepsilon_0}{4k^2\sin^2(\theta/2)} = -\frac{Z_1Z_2e^2/4\pi\varepsilon_0}{4E\sin^2(\theta/2)} ,$$
$$\boxed{\ \frac{d\sigma}{d\Omega} = \left(\frac{Z_1Z_2e^2}{16\pi\varepsilon_0 E}\right)^{\!2}\frac{1}{\sin^4(\theta/2)}\ }$$
— exactly **Rutherford's** formula.

**The remarkable fact.** The Coulomb potential is the unique case where the classical calculation, the first Born approximation, and the exact quantum (Coulomb-wave) treatment all give the *same* differential cross-section — the exact result differs only by an unobservable phase. Historically this is why Rutherford's classical 1911 analysis of the gold-foil experiment gave the correct answer at all, a decade before quantum mechanics existed. This is a standard UPSC "comment on" rider; write it out.

Note also that the total Coulomb cross-section **diverges** ($\int \sin^{-4}(\theta/2)d\Omega = \infty$) because the $1/r$ potential has infinite range — every particle is deflected by *something*. Screening (the Yukawa form) is what makes it finite in reality.

### (d) Validity

The approximation requires the scattered wave to be small compared with the incident wave *inside* the potential region. For a potential of depth $V_0$ and range $a$ this gives, at low energy,
$$\frac{m|V_0|a^2}{\hbar^2}\ll1 \qquad\text{(weak potential — no bound states)},$$
and at high energy the weaker condition
$$\frac{m|V_0|a}{\hbar^2k}\ll1 \qquad\text{(fast projectile — little time to be deflected)}.$$
So **Born is the high-energy / weak-potential method; partial waves is the low-energy / strong-potential method.** They are complementary, and saying so explicitly is the "compare and contrast" answer UPSC often asks for directly.

---

## P8 — Identical particles and exchange

### (a) Symmetrisation postulate

Identical particles are indistinguishable in principle, so the exchange operator $\hat P_{12}$ (which satisfies $\hat P_{12}^2 = 1$, hence has eigenvalues $\pm1$) must commute with $\hat H$, and physical states must be eigenstates of it:
$$\psi(1,2) = +\psi(2,1)\ \text{(bosons, integer spin)},\qquad \psi(1,2)=-\psi(2,1)\ \text{(fermions, half-integer spin)}.$$
(The spin–statistics connection itself is a result of relativistic QFT; state that it is an *input* here.)

For two particles in single-particle states $\psi_a,\psi_b$:
$$\psi_\pm(1,2) = \frac{1}{\sqrt2}\left[\psi_a(1)\psi_b(2) \pm \psi_b(1)\psi_a(2)\right].$$

**Pauli principle:** put $a=b$ in the antisymmetric combination — it vanishes identically. Two identical fermions cannot occupy the same single-particle state. For $N$ fermions the general antisymmetric state is the **Slater determinant**, which vanishes whenever two rows coincide.

### (b) Two particles in an infinite well

Single-particle levels $E_n = n^2E_1$, $E_1 = \pi^2\hbar^2/2mL^2$.

| Case | Ground state | Energy | 1st excited level | Degeneracy |
|---|---|---|---|---|
| Distinguishable | $(1,1)$ | $2E_1$ | $(1,2)$ or $(2,1)$ | $5E_1$, 2-fold |
| Identical **bosons** (spin 0) | both $n=1$ | $2E_1$ | symmetric $(1,2)$ | $5E_1$, 1-fold |
| Identical **fermions** (spin $\tfrac12$) | $n=1$ ↑ and $n=1$ ↓ | $2E_1$ | $n=1,\,n=2$ | $5E_1$, 4-fold (1 singlet + 3 triplet) |
| Identical **spinless fermions** | $n=1,\,n=2$ | $5E_1$ | $(1,3)$ | $10E_1$, 1-fold |

Two points UPSC rewards: (i) spin-$\tfrac12$ fermions *can* share $n=1$ because the antisymmetry is carried by the **spin** part (singlet), so the ground energy is still $2E_1$ — the exclusion principle forbids identical *total* states, not identical spatial ones; (ii) the degeneracy counts differ even when the energies agree, and it is the degeneracy that shows up in the partition function and hence in thermodynamics.

### (c) Exchange splitting and helium

For a two-electron atom, $\hat H = h(1)+h(2) + \dfrac{e^2}{4\pi\varepsilon_0|\mathbf r_1-\mathbf r_2|}$. The total state must be antisymmetric, so

- **spatially symmetric** $\psi_+$ × **antisymmetric spin singlet** ($S=0$) → *para*-helium;
- **spatially antisymmetric** $\psi_-$ × **symmetric spin triplet** ($S=1$) → *ortho*-helium.

First-order energy shift from the repulsion:
$$\langle\psi_\pm|\frac{e^2}{4\pi\varepsilon_0 r_{12}}|\psi_\pm\rangle = J \pm K,$$
$$J = \iint |\psi_a(1)|^2\frac{e^2/4\pi\varepsilon_0}{r_{12}}|\psi_b(2)|^2 d^3r_1d^3r_2 \quad\text{(direct — classical charge-cloud repulsion)},$$
$$K = \iint \psi_a^*(1)\psi_b^*(2)\frac{e^2/4\pi\varepsilon_0}{r_{12}}\psi_b(1)\psi_a(2)\,d^3r_1 d^3r_2 \quad\text{(exchange — no classical analogue)} .$$

For the He **1s2s** configuration, $J>0$ and $K>0$, so
$$E(\text{singlet, para}) = E_0 + J + K,\qquad E(\text{triplet, ortho}) = E_0 + J - K,$$
$$\boxed{\ \Delta E = E_{\text{singlet}} - E_{\text{triplet}} = 2K > 0\ }$$

**So ortho-helium (S = 1) lies below para-helium.** The Hamiltonian contains **no spin-dependent term whatever**; the splitting is a purely electrostatic effect that the antisymmetry requirement *converts* into an apparent spin dependence. In the triplet the spatial wavefunction is antisymmetric, so it vanishes at $\mathbf r_1=\mathbf r_2$ (a "Fermi hole") — the electrons stay farther apart, their Coulomb repulsion is smaller, and the energy is lower. This is the correct answer to "why does Hund's first rule work", and it is the microscopic origin of the **Heisenberg exchange interaction** $\hat H = -2K\,\hat{\mathbf S}_1\cdot\hat{\mathbf S}_2$ and hence of ferromagnetism (which you will meet again in the Solid State fortnight).

For the He **ground state** $1s^2$, only the singlet exists — the triplet would require an antisymmetric spatial function built from two identical orbitals, which vanishes. There is no ortho ground state, which is why the ortho and para systems behave almost like two separate species (intercombination lines $S=1\leftrightarrow S=0$ are strongly forbidden).

### (d) The exchange "force"

Compute the mean-square separation for the three cases. For distinguishable particles,
$$\langle(x_1-x_2)^2\rangle_d = \langle x^2\rangle_a + \langle x^2\rangle_b - 2\langle x\rangle_a\langle x\rangle_b .$$
For the symmetrised states $\psi_\pm$, carrying out the same computation gives an extra term:
$$\boxed{\ \langle(x_1-x_2)^2\rangle_\pm = \langle(x_1-x_2)^2\rangle_d \mp 2\big|\langle x\rangle_{ab}\big|^2,\qquad \langle x\rangle_{ab}\equiv\int \psi_a^*x\,\psi_b\,dx }$$

- **Bosons** ($+$): the separation is *reduced* — an effective **attraction** (the physical origin of Bose–Einstein condensation's bunching, and of the Hanbury Brown–Twiss effect).
- **Fermions** ($-$): the separation is *increased* — an effective **repulsion** (degeneracy pressure, white dwarfs, the Fermi hole above).

Crucially this is **not a force**: no term in the Hamiltonian produces it. It is a kinematic consequence of symmetrisation. Note also that the effect vanishes when $\langle x\rangle_{ab}=0$, i.e. when the two orbitals **do not overlap** — which is why we can treat well-separated electrons (say, in two different atoms in a gas) as distinguishable and ignore the whole business. That last observation is the one most candidates miss.

---

## Recurring-pattern insights

**1. UPSC almost never asks an approximation method in the abstract — it asks the *one canonical application* attached to it.** Across the last two decades the pairing is remarkably stable: WKB → **alpha decay / Gamow factor** (and, less often, the SHO-is-exact check); variational method → **helium ground state or hydrogen with a Gaussian/exponential trial function**; time-dependent PT → **Fermi's Golden Rule, then dipole selection rules or the Einstein $B$ coefficient**; sudden approximation → **tritium beta decay** (this exact problem has appeared, in some form, many times); Born approximation → **Yukawa, then take the Rutherford limit**; partial waves → **hard sphere, then the low-energy $4\pi a^2$**. Prepare the *pairs*, not the methods. If you can produce these six applications cold, you can answer essentially any question this section poses, because the examiner has to reach for one of them.

**2. The "compare the two limits" rider is nearly guaranteed, and it is where the marks are lost.** Sudden vs adiabatic; Born vs partial waves; low-energy vs high-energy hard-sphere cross-section; three-level vs four-level; classical vs Born vs exact for Coulomb. UPSC likes questions that end *"...hence state the conditions under which each is valid"* or *"...compare with the classical result"*, because they separate candidates who memorised a derivation from those who understand it. Budget the last 3–4 minutes of every answer in this section for an explicit validity/comparison paragraph — it is the cheapest 3 marks on the paper, and it is the part most candidates run out of time for.

**3. Numericals in this block are almost always "plug into an exponent" problems, and they are graded on setup, not arithmetic.** Gamow penetrability, transition rates, cross-sections — the answers span dozens of orders of magnitude, so the examiner cannot expect precision. What earns the marks is: correct expression, correct units (use $\hbar c = 197.3$ MeV·fm and $e^2/4\pi\varepsilon_0 = 1.44$ MeV·fm and *never* convert to SI in a nuclear problem), a stated numerical value, and one sentence of physical comment on the magnitude. Getting $10^{-39}$ instead of $10^{-38}$ costs nothing; failing to say "hence the half-life is of order $10^9$ years, consistent with observation" costs 2 marks.

---

## One tip

**Build a one-page "approximation-method decision tree" this week and keep it at the front of your formula log.** The single most common failure in this section is not algebraic — it is picking the wrong tool under time pressure and burning fifteen minutes before realising. The tree has four branches, and each question announces its branch in the first line:

- *Is the change in $\hat H$ fast or slow?* Fast ($\tau \ll \hbar/\Delta E$) → **sudden**: overlap integral. Slow → **adiabatic**: stays in the corresponding eigenstate.
- *Is the perturbation time-dependent?* Yes → **time-dependent PT / Golden Rule** (rates, transitions). No → **time-independent PT** (level shifts) — but only if the unperturbed problem is solvable and $|H'|$ is small.
- *Is there no small parameter at all?* → **variational** (ground states only, gives an upper bound) or **WKB** (if the potential is smooth on the de Broglie scale, and especially if the question mentions turning points, tunnelling, or "semi-classical").
- *Is it a scattering problem?* Low energy or strong potential → **partial waves** ($ka\lesssim1$, s-wave dominates, quote the scattering length). High energy or weak potential → **Born** (Fourier transform the potential).

Write the tree from memory each morning for a week until it is automatic. Then when a Paper II question opens with *"A particle of energy E is incident on..."* or *"...the nuclear charge suddenly changes..."*, you have already chosen your method before you have finished reading the sentence — and in a 3-hour paper where you are expected to write eight full answers, that reflex is worth more than any single derivation.

---

*Next fortnight (F7, 25 Aug – 7 Sep): **Atomic & Molecular Physics** — fine and hyperfine structure, LS vs jj coupling, Zeeman & Stark effects, X-ray spectra and Moseley's law, rotational-vibrational and Raman spectra, NMR/ESR. Everything in it leans on the perturbation theory of `2026-08-04` and the Golden Rule derived above.*
