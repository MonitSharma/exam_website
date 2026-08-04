# Physics Optional PYQ Plan — week of 2026-08-04

**Paper II · Quantum Mechanics (Part 1) · Topic: Formalism, 1-D Potentials, Harmonic Oscillator & Angular Momentum**

> **Why this topic now:** Last week (`2026-07-28`) closed Thermodynamics & Statistical Mechanics, which completed **Paper I end-to-end** — Mechanics ✅, Electrodynamics ✅, Optics I ✅, Optics II ✅, Thermo & Stat Mech ✅. The rotation now moves entirely into **Paper II**, and Quantum Mechanics is the correct entry point: it is both the largest single block of the Paper II syllabus and the *prerequisite* for Atomic & Molecular, Nuclear, and Solid State, which all assume you can already solve an eigenvalue problem, use ladder operators, and run perturbation theory. Doing QM first makes the next four fortnights cheaper.

**Rotation tracker — Paper I (complete):** Lagrangian/Hamiltonian ✅ · Central force ✅ · Rigid body ✅ · Electrodynamics ✅ · Optics Pt 1 ✅ · Optics Pt 2 ✅ · Thermo & Stat Mech ✅
**Paper II — this week:** **Quantum Mechanics Part 1 (formalism, 1-D potentials, SHO, angular momentum, perturbation theory, spin).**
**Still to rotate through (Paper II):** QM Part 2 (scattering, WKB, identical particles, time-dependent PT) · Atomic & Molecular Physics · Nuclear & Particle Physics · Solid State · Electronics · Special Relativity.

---

## How to use this set (timed)

1. **Attempt closed-book, ~110 minutes.** Treat **P1, P4, P6** as 20-markers; **P2, P5, P7, P8** as 15-markers; **P3** as a 15-mark derivation-plus-numerical.
2. **Always state the boundary conditions and the normalisation explicitly.** In QM, UPSC awards marks for *"ψ and ψ′ continuous at the step"*, *"ψ → 0 as x → ±∞ so the state is bound"*, *"H′ has odd parity, hence the first-order shift vanishes"*. Writing the physical justification alongside the algebra is worth 3–4 marks per question.
3. **Sketch every wavefunction and probability density you derive** — ψₙ and |ψₙ|² for the box (P2), the exponential decay inside the barrier (P3), the SHO ground and first excited state (P4), the radial distribution P(r) = r²|R|² for hydrogen (P6). These are the cheapest marks in Paper II.
4. **Then** check against the worked solutions below, and log every boxed result into your **Formula & Derivation Master Log** under *"Quantum Mechanics — Core."*
5. **Source the real papers yourself:** UPSC official site (`upsc.gov.in` → *Examination → Previous Year Question Papers*) → download the **Physics Paper II** PDFs across the last ~20 years. Search each for `"expectation value"`, `"Ehrenfest"`, `"uncertainty principle"`, `"particle in a box"`, `"potential barrier"`, `"tunnelling"`, `"harmonic oscillator"`, `"ladder operator"`, `"creation and annihilation"`, `"commutation relation"`, `"hydrogen atom"`, `"degeneracy"`, `"perturbation theory"`, `"Stark effect"`, `"Pauli matrices"`, `"Stern-Gerlach"`. Texts that mirror UPSC phrasing: **Griffiths, *Introduction to Quantum Mechanics*** (closest match to UPSC's wording and problem style), **Zettili** (worked-example format — best for exam practice), **Schiff** and **Gasiorowicz** for the formal derivations, **Mathews & Venkatesan** for the Indian-syllabus treatment.

> ⚠️ **Honesty note:** The 8 problems below are **representative UPSC-style** items built on the exact derivations and numericals UPSC repeats in this section. They are **not** claimed to be verbatim past questions — treat the specific wording as mine, not UPSC's. Pull the actual Paper II PDFs from `upsc.gov.in` for exact phrasing and mark allocation. **Never treat these as the real paper.**

---

## Problems (representative UPSC-style — closed-book attempt first)

**P1 (the perennial formalism 20-marker).**
(a) State the postulates of quantum mechanics. Show that a Hermitian operator has real eigenvalues and that eigenfunctions belonging to distinct eigenvalues are orthogonal.
(b) Derive the **generalised uncertainty relation** for two observables $A$ and $B$:
$$\sigma_A^2\,\sigma_B^2 \;\ge\; \left(\frac{1}{2i}\big\langle [\hat A,\hat B]\big\rangle\right)^{\!2}.$$
Hence obtain the Heisenberg relation $\Delta x\,\Delta p \ge \hbar/2$.
(c) Derive **Ehrenfest's theorem**, $\dfrac{d\langle x\rangle}{dt} = \dfrac{\langle p\rangle}{m}$ and $\dfrac{d\langle p\rangle}{dt} = -\left\langle \dfrac{\partial V}{\partial x}\right\rangle$, and comment on the classical limit.

**P2 (particle in a box).** A particle of mass $m$ is confined to the infinite square well $V=0$ for $0<x<L$, $V=\infty$ otherwise.
(a) Solve the time-independent Schrödinger equation, state the boundary conditions, and obtain the normalised eigenfunctions and energy eigenvalues.
(b) Compute $\langle x\rangle$, $\langle x^2\rangle$, $\langle p\rangle$, $\langle p^2\rangle$ for the state $n$, and verify the uncertainty principle. Show $\Delta x\,\Delta p$ is minimum for $n=1$.
(c) **Numerical:** For an electron confined to $L = 1\ \text{Å}$, find $E_1$ and $E_2$ in eV and the wavelength of the photon emitted in the $2\to1$ transition.

**P3 (barrier penetration).** A beam of particles of energy $E$ is incident on a rectangular potential barrier of height $V_0>E$ and width $a$.
(a) Write the solutions in the three regions, impose continuity of $\psi$ and $\psi'$, and derive the transmission coefficient
$$T=\left[1+\frac{V_0^2\sinh^2(\kappa a)}{4E(V_0-E)}\right]^{-1},\qquad \kappa=\frac{\sqrt{2m(V_0-E)}}{\hbar}.$$
(b) Show that for a thick/high barrier ($\kappa a\gg1$) this reduces to $T\approx \dfrac{16E(V_0-E)}{V_0^2}e^{-2\kappa a}$.
(c) **Numerical:** An electron of energy $5\ \text{eV}$ strikes a barrier of height $10\ \text{eV}$ and width $0.5\ \text{nm}$. Compute $\kappa$ and $T$.
(d) Name two physical phenomena explained by tunnelling and state how $T$ depends on the particle mass.

**P4 (harmonic oscillator by operators — 20-marker).** For the 1-D harmonic oscillator $\hat H = \dfrac{\hat p^2}{2m} + \dfrac12 m\omega^2\hat x^2$:
(a) Define the ladder operators $\hat a,\hat a^\dagger$ and prove $[\hat a,\hat a^\dagger]=1$ and $[\hat H,\hat a^\dagger]=\hbar\omega\,\hat a^\dagger$.
(b) Using only the algebra (no differential equation), show that the spectrum is $E_n=(n+\tfrac12)\hbar\omega$, $n=0,1,2,\dots$, and explain why $n$ must be a non-negative integer.
(c) Obtain the normalised ground-state wavefunction from $\hat a\psi_0=0$.
(d) Evaluate $\langle x^2\rangle_n$ and $\langle p^2\rangle_n$, verify the **virial theorem** $\langle T\rangle=\langle V\rangle=E_n/2$, and show $\Delta x\,\Delta p=(n+\tfrac12)\hbar$.

**P5 (angular momentum algebra).**
(a) From $[\hat L_i,\hat L_j]=i\hbar\epsilon_{ijk}\hat L_k$, prove $[\hat L^2,\hat L_z]=0$ and hence that $\hat L^2$ and $\hat L_z$ have simultaneous eigenstates.
(b) Define $\hat L_\pm = \hat L_x \pm i\hat L_y$, establish $[\hat L_z,\hat L_\pm]=\pm\hbar\hat L_\pm$, and show that $\hat L_\pm$ raises/lowers the $\hat L_z$ eigenvalue by $\hbar$.
(c) Using the requirement that the ladder terminate at both ends, derive the eigenvalues $\hat L^2\to \ell(\ell+1)\hbar^2$ and $\hat L_z\to m\hbar$ with $m=-\ell,\dots,+\ell$, and explain why $\ell$ can be half-integral in general but must be integral for **orbital** angular momentum.

**P6 (hydrogen atom — 20-marker).**
(a) Separate the Schrödinger equation for the Coulomb potential $V(r)=-\dfrac{e^2}{4\pi\varepsilon_0 r}$ into radial and angular parts, and write the radial equation with its effective potential.
(b) Obtain the energy eigenvalues $E_n=-\dfrac{13.6}{n^2}\ \text{eV}$ and identify the Bohr radius $a_0$ in terms of fundamental constants.
(c) Show that the degeneracy of the level $n$ is $n^2$ (without spin) and $2n^2$ (with spin), and state the origin of the $\ell$-degeneracy.
(d) For the ground state $\psi_{100}=\dfrac{1}{\sqrt{\pi a_0^3}}e^{-r/a_0}$, compute $\langle r\rangle$ and the **most probable** radius, and explain why they differ.

**P7 (time-independent perturbation theory).**
(a) Derive the first- and second-order corrections to a non-degenerate energy level, $E_n^{(1)}=\langle n^{(0)}|\hat H'|n^{(0)}\rangle$ and $E_n^{(2)}=\displaystyle\sum_{k\ne n}\frac{|\langle k^{(0)}|\hat H'|n^{(0)}\rangle|^2}{E_n^{(0)}-E_k^{(0)}}$, and the first-order correction to the state.
(b) Show that $E_0^{(2)}$ for the ground state is always **negative**.
(c) **Application 1:** A charged harmonic oscillator (charge $q$) is placed in a uniform electric field $\mathcal E$, so $\hat H'=-q\mathcal E \hat x$. Show that $E_n^{(1)}=0$ and $E_n^{(2)}=-\dfrac{q^2\mathcal E^2}{2m\omega^2}$, and verify this against the **exact** solution obtained by completing the square.
(d) **Application 2:** For the anharmonic perturbation $\hat H'=\lambda \hat x^4$, show that
$$E_n^{(1)}=3\lambda\left(\frac{\hbar}{2m\omega}\right)^{2}\!\left(2n^2+2n+1\right).$$

**P8 (spin-½ and Stern–Gerlach).**
(a) Write the Pauli matrices, verify $\sigma_i\sigma_j=\delta_{ij}I+i\epsilon_{ijk}\sigma_k$, and hence $[\sigma_i,\sigma_j]=2i\epsilon_{ijk}\sigma_k$, $\{\sigma_i,\sigma_j\}=2\delta_{ij}I$.
(b) Find the eigenvalues and normalised eigenspinors of $\hat S\cdot\hat n$ where $\hat n=(\sin\theta\cos\phi,\sin\theta\sin\phi,\cos\theta)$.
(c) A beam of silver atoms passes a Stern–Gerlach analyser oriented along $+z$; the "spin-up" output is fed into a second analyser oriented along a direction $\hat n$ making an angle $\theta$ with $z$. Show that the probability of measuring $+\hbar/2$ in the second device is $\cos^2(\theta/2)$, and evaluate it for $\theta=60^\circ$ and $\theta=90^\circ$.
(d) Explain what the original Stern–Gerlach experiment established that the Bohr–Sommerfeld model could not.

---

## Key formulas (add to the log)

| # | Formula | Meaning |
|---|---|---|
| 1 | $i\hbar\,\partial_t\Psi = \hat H\Psi$ | time-dependent Schrödinger equation |
| 2 | $\sigma_A^2\sigma_B^2 \ge \left(\tfrac{1}{2i}\langle[\hat A,\hat B]\rangle\right)^2$ | generalised uncertainty relation |
| 3 | $\dfrac{d\langle Q\rangle}{dt}=\dfrac{i}{\hbar}\langle[\hat H,\hat Q]\rangle + \left\langle\dfrac{\partial \hat Q}{\partial t}\right\rangle$ | Ehrenfest / generalised equation of motion |
| 4 | $E_n=\dfrac{n^2\pi^2\hbar^2}{2mL^2}=\dfrac{n^2h^2}{8mL^2}$, $\psi_n=\sqrt{\tfrac2L}\sin\tfrac{n\pi x}{L}$ | infinite square well |
| 5 | $T\approx \dfrac{16E(V_0-E)}{V_0^2}e^{-2\kappa a}$, $\kappa=\sqrt{2m(V_0-E)}/\hbar$ | barrier tunnelling (thick barrier) |
| 6 | $\hat a=\sqrt{\tfrac{m\omega}{2\hbar}}\left(\hat x+\tfrac{i\hat p}{m\omega}\right)$, $[\hat a,\hat a^\dagger]=1$ | SHO ladder operators |
| 7 | $\hat a|n\rangle=\sqrt n\,|n-1\rangle$, $\hat a^\dagger|n\rangle=\sqrt{n+1}\,|n+1\rangle$, $E_n=(n+\tfrac12)\hbar\omega$ | SHO spectrum |
| 8 | $\langle x^2\rangle_n=(n+\tfrac12)\dfrac{\hbar}{m\omega}$, $\langle p^2\rangle_n=(n+\tfrac12)m\hbar\omega$ | SHO second moments |
| 9 | $\hat L^2|\ell m\rangle=\ell(\ell+1)\hbar^2|\ell m\rangle$, $\hat L_z|\ell m\rangle=m\hbar|\ell m\rangle$ | angular momentum eigenvalues |
| 10 | $\hat L_\pm|\ell m\rangle=\hbar\sqrt{\ell(\ell+1)-m(m\pm1)}\,|\ell,m\pm1\rangle$ | angular momentum ladder |
| 11 | $E_n=-\dfrac{m e^4}{32\pi^2\varepsilon_0^2\hbar^2 n^2}=-\dfrac{13.6\ \text{eV}}{n^2}$ | hydrogen levels |
| 12 | $a_0=\dfrac{4\pi\varepsilon_0\hbar^2}{me^2}=0.529\ \text{Å}$ | Bohr radius |
| 13 | $\langle r\rangle_{n\ell}=\dfrac{a_0}{2}\big[3n^2-\ell(\ell+1)\big]$ | hydrogen radial expectation |
| 14 | $E_n^{(1)}=\langle n|\hat H'|n\rangle$, $E_n^{(2)}=\sum_{k\ne n}\dfrac{|H'_{kn}|^2}{E_n^{(0)}-E_k^{(0)}}$ | non-degenerate perturbation theory |
| 15 | $\sigma_i\sigma_j=\delta_{ij}I+i\epsilon_{ijk}\sigma_k$ | Pauli algebra |

**Constants to know cold:** $\hbar=1.055\times10^{-34}\ \text{J s}$ · $m_e=9.11\times10^{-31}\ \text{kg}=0.511\ \text{MeV}/c^2$ · $a_0=0.529\ \text{Å}$ · $13.6\ \text{eV}$ · $hc=1240\ \text{eV nm}$ · $1\ \text{eV}=1.602\times10^{-19}\ \text{J}$.

---

# Worked Solutions

---

## P1 — Formalism, uncertainty, Ehrenfest

### (a) Hermitian operators

An operator $\hat A$ is Hermitian if $\langle f|\hat A g\rangle = \langle \hat A f|g\rangle$ for all admissible $f,g$.

**Real eigenvalues.** Let $\hat A\psi = a\psi$ with $\langle\psi|\psi\rangle=1$. Then
$$a = \langle\psi|\hat A\psi\rangle = \langle \hat A\psi|\psi\rangle = a^*\langle\psi|\psi\rangle = a^* .$$
Hence $a\in\mathbb R$. ∎

**Orthogonality.** Let $\hat A\psi_1=a_1\psi_1$, $\hat A\psi_2=a_2\psi_2$ with $a_1\ne a_2$. Then
$$a_2\langle\psi_1|\psi_2\rangle = \langle\psi_1|\hat A\psi_2\rangle = \langle\hat A\psi_1|\psi_2\rangle = a_1^*\langle\psi_1|\psi_2\rangle = a_1\langle\psi_1|\psi_2\rangle,$$
so $(a_2-a_1)\langle\psi_1|\psi_2\rangle = 0 \Rightarrow \langle\psi_1|\psi_2\rangle = 0$. ∎

*(Postulates to state: state ↔ normalised vector in Hilbert space; observables ↔ Hermitian operators; measurement yields an eigenvalue with probability $|\langle a|\psi\rangle|^2$; collapse; unitary time evolution by the Schrödinger equation.)*

### (b) Generalised uncertainty relation

Define $\hat f = (\hat A - \langle A\rangle)\psi$ and $\hat g = (\hat B-\langle B\rangle)\psi$, so $\sigma_A^2 = \langle f|f\rangle$, $\sigma_B^2=\langle g|g\rangle$.

By the **Schwarz inequality**, $\langle f|f\rangle\langle g|g\rangle \ge |\langle f|g\rangle|^2$. For any complex $z$, $|z|^2 \ge [\text{Im}(z)]^2 = \left[\frac{1}{2i}(z-z^*)\right]^2$. Taking $z=\langle f|g\rangle$:
$$\sigma_A^2\sigma_B^2 \;\ge\; \left[\frac{1}{2i}\Big(\langle f|g\rangle - \langle g|f\rangle\Big)\right]^2 .$$

Now expand, using $\langle A\rangle,\langle B\rangle$ real:
$$\langle f|g\rangle = \langle \hat A\hat B\rangle - \langle A\rangle\langle B\rangle,\qquad \langle g|f\rangle = \langle \hat B\hat A\rangle - \langle A\rangle\langle B\rangle .$$
Subtracting, the cross terms cancel:
$$\langle f|g\rangle - \langle g|f\rangle = \langle [\hat A,\hat B]\rangle .$$

$$\boxed{\;\sigma_A^2\sigma_B^2 \ge \left(\frac{1}{2i}\big\langle[\hat A,\hat B]\big\rangle\right)^{\!2}\;}$$

**Heisenberg case.** With $\hat A=\hat x$, $\hat B=\hat p$ and $[\hat x,\hat p]=i\hbar$:
$$\sigma_x^2\sigma_p^2 \ge \left(\frac{i\hbar}{2i}\right)^2 = \frac{\hbar^2}{4} \;\Longrightarrow\; \boxed{\Delta x\,\Delta p \ge \frac{\hbar}{2}}$$

*Note for the exam:* the inequality is saturated only when $|g\rangle = ic|f\rangle$ with $c$ real — which, worked out, gives a **Gaussian** wave packet. Say this; it is a standard follow-up.

### (c) Ehrenfest's theorem

For any operator $\hat Q$,
$$\frac{d}{dt}\langle Q\rangle = \frac{d}{dt}\langle\Psi|\hat Q|\Psi\rangle = \left\langle \frac{\partial\Psi}{\partial t}\Big|\hat Q\Big|\Psi\right\rangle + \left\langle \Psi\Big|\hat Q\Big|\frac{\partial\Psi}{\partial t}\right\rangle + \left\langle\frac{\partial \hat Q}{\partial t}\right\rangle .$$
Insert $\partial_t\Psi = \frac{1}{i\hbar}\hat H\Psi$ and use Hermiticity of $\hat H$:
$$\boxed{\;\frac{d\langle Q\rangle}{dt} = \frac{i}{\hbar}\big\langle[\hat H,\hat Q]\big\rangle + \left\langle\frac{\partial\hat Q}{\partial t}\right\rangle\;}$$

**Take $\hat Q = \hat x$** (no explicit $t$). With $\hat H = \frac{\hat p^2}{2m}+V$:
$$[\hat H,\hat x] = \frac{1}{2m}[\hat p^2,\hat x] = \frac{1}{2m}\big(\hat p[\hat p,\hat x]+[\hat p,\hat x]\hat p\big) = \frac{1}{2m}(-2i\hbar\hat p) = -\frac{i\hbar\hat p}{m}.$$
$$\frac{d\langle x\rangle}{dt} = \frac{i}{\hbar}\left(-\frac{i\hbar}{m}\right)\langle p\rangle = \boxed{\frac{\langle p\rangle}{m}}$$

**Take $\hat Q=\hat p$.** $[\hat H,\hat p] = [V,\hat p] = i\hbar\,\dfrac{\partial V}{\partial x}$ (act on a test function to confirm). Hence
$$\frac{d\langle p\rangle}{dt} = \frac{i}{\hbar}\left(i\hbar\left\langle\frac{\partial V}{\partial x}\right\rangle\right) = \boxed{-\left\langle\frac{\partial V}{\partial x}\right\rangle}$$

**Classical limit.** These are Newton's equations for the *expectation values*. They become the classical equations exactly when $\left\langle \frac{\partial V}{\partial x}\right\rangle = \frac{\partial V}{\partial x}\Big|_{\langle x\rangle}$ — true for $V$ at most quadratic (free particle, uniform field, harmonic oscillator), and approximately true whenever the wave packet is narrow compared with the scale over which $V'$ varies.

---

## P2 — Infinite square well

### (a) Eigenfunctions and eigenvalues

Inside the well $V=0$, so
$$-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2} = E\psi \;\Longrightarrow\; \frac{d^2\psi}{dx^2}=-k^2\psi,\qquad k=\frac{\sqrt{2mE}}{\hbar}.$$
General solution $\psi(x)=A\sin kx + B\cos kx$.

**Boundary conditions.** $\psi$ must vanish at the walls (the wavefunction cannot penetrate an infinite potential; $\psi'$ need *not* be continuous here, because $V$ is infinite — state this, UPSC asks it).
- $\psi(0)=0 \Rightarrow B=0$.
- $\psi(L)=0 \Rightarrow A\sin kL=0 \Rightarrow kL=n\pi$, $n=1,2,3,\dots$ ($n=0$ gives $\psi\equiv0$, not a state).

**Normalisation.** $\int_0^L A^2\sin^2\frac{n\pi x}{L}\,dx = A^2\frac{L}{2}=1 \Rightarrow A=\sqrt{2/L}$.

$$\boxed{\;\psi_n(x)=\sqrt{\frac{2}{L}}\sin\frac{n\pi x}{L},\qquad E_n=\frac{n^2\pi^2\hbar^2}{2mL^2}=\frac{n^2h^2}{8mL^2}\;}$$

### (b) Expectation values and the uncertainty product

$$\langle x\rangle = \frac{2}{L}\int_0^L x\sin^2\frac{n\pi x}{L}dx = \frac{L}{2}\quad\text{(by symmetry about the midpoint).}$$

$$\langle x^2\rangle = \frac{2}{L}\int_0^L x^2\sin^2\frac{n\pi x}{L}dx .$$
Write $\sin^2\theta = \tfrac12(1-\cos2\theta)$:
$$\langle x^2\rangle = \frac{1}{L}\int_0^L x^2dx - \frac{1}{L}\int_0^L x^2\cos\frac{2n\pi x}{L}dx = \frac{L^2}{3} - \frac{1}{L}\cdot\frac{L^3}{2n^2\pi^2} = \boxed{\frac{L^2}{3}-\frac{L^2}{2n^2\pi^2}}$$

$$\sigma_x^2 = \langle x^2\rangle - \langle x\rangle^2 = L^2\left(\frac{1}{12}-\frac{1}{2n^2\pi^2}\right).$$

For momentum: $\psi_n$ is real, so $\langle p\rangle = 0$ (a real bound-state wavefunction carries no net current). And since $\hat p^2 = 2m\hat H$ inside the well,
$$\langle p^2\rangle = 2mE_n = \frac{n^2\pi^2\hbar^2}{L^2} \;\Longrightarrow\; \sigma_p = \frac{n\pi\hbar}{L}.$$

$$\Delta x\,\Delta p = \frac{n\pi\hbar}{L}\cdot L\sqrt{\frac{1}{12}-\frac{1}{2n^2\pi^2}} = \hbar\sqrt{\frac{n^2\pi^2}{12}-\frac12}.$$

For $n=1$: $\sqrt{\pi^2/12 - 1/2} = \sqrt{0.8225-0.5}=\sqrt{0.3225}=0.568$, so $\Delta x\Delta p = 0.568\hbar > \hbar/2$ ✓ — and it grows monotonically with $n$, so the **ground state is closest to the bound** (though it never saturates it, because $\psi_1$ is a sine, not a Gaussian).

### (c) Numerical — electron in $L=1\ \text{Å}$

$$E_1 = \frac{h^2}{8mL^2} = \frac{(6.626\times10^{-34})^2}{8(9.11\times10^{-31})(1\times10^{-10})^2} = \frac{4.390\times10^{-67}}{7.288\times10^{-50}} = 6.02\times10^{-18}\ \text{J}$$

$$\boxed{E_1 = 37.6\ \text{eV}},\qquad \boxed{E_2 = 4E_1 = 150.4\ \text{eV}}$$

Transition energy $\Delta E = E_2-E_1 = 3E_1 = 112.8\ \text{eV}$.

$$\lambda = \frac{hc}{\Delta E} = \frac{1240\ \text{eV nm}}{112.8\ \text{eV}} = \boxed{11.0\ \text{nm}}\quad(\text{soft X-ray / extreme UV}).$$

*Comment worth a mark:* an atomic-scale box gives level spacings of tens of eV — the right order of magnitude for atomic transitions, which is why the box is a useful zeroth model.

---

## P3 — Rectangular barrier tunnelling

### (a) Matching and $T$

Regions: I ($x<0$, $V=0$), II ($0<x<a$, $V=V_0$), III ($x>a$, $V=0$), with $E<V_0$.

$$\psi_I = Ae^{ikx}+Be^{-ikx},\qquad \psi_{II}=Ce^{\kappa x}+De^{-\kappa x},\qquad \psi_{III}=Fe^{ikx}$$
with $k=\sqrt{2mE}/\hbar$, $\kappa=\sqrt{2m(V_0-E)}/\hbar$. There is no $e^{-ikx}$ term in III: nothing comes back from $+\infty$ (state this).

Continuity of $\psi$ and $\psi'$ at $x=0$ and $x=a$ gives four equations:
$$A+B=C+D,\qquad ik(A-B)=\kappa(C-D)$$
$$Ce^{\kappa a}+De^{-\kappa a}=Fe^{ika},\qquad \kappa\!\left(Ce^{\kappa a}-De^{-\kappa a}\right)=ikFe^{ika}$$

Solve the last pair for $C,D$ in terms of $F$:
$$C=\frac{F}{2}\left(1+\frac{ik}{\kappa}\right)e^{ika-\kappa a},\qquad D=\frac{F}{2}\left(1-\frac{ik}{\kappa}\right)e^{ika+\kappa a}.$$
Substituting into the first pair and eliminating $B$ gives
$$\frac{A}{F}=e^{ika}\left[\cosh\kappa a + \frac{i}{2}\left(\frac{\kappa}{k}-\frac{k}{\kappa}\right)\sinh\kappa a\right].$$
Hence, using $\cosh^2=1+\sinh^2$,
$$\left|\frac{A}{F}\right|^2 = 1+\left[1+\frac14\left(\frac{\kappa}{k}-\frac{k}{\kappa}\right)^2\right]\sinh^2\kappa a = 1+\frac{(k^2+\kappa^2)^2}{4k^2\kappa^2}\sinh^2\kappa a .$$
With $k^2=\frac{2mE}{\hbar^2}$, $\kappa^2=\frac{2m(V_0-E)}{\hbar^2}$: $k^2+\kappa^2 = \frac{2mV_0}{\hbar^2}$ and $k^2\kappa^2=\frac{4m^2E(V_0-E)}{\hbar^4}$, so

$$\boxed{\;T=\left|\frac{F}{A}\right|^2=\left[1+\frac{V_0^2\sinh^2(\kappa a)}{4E(V_0-E)}\right]^{-1}\;}$$

### (b) Thick-barrier limit

For $\kappa a\gg1$: $\sinh\kappa a \approx \tfrac12 e^{\kappa a}$, so $\sinh^2\kappa a\approx\tfrac14 e^{2\kappa a}\gg1$ and the "1" is negligible:
$$T\approx \frac{4E(V_0-E)}{V_0^2}\cdot\frac{4}{e^{2\kappa a}} = \boxed{\frac{16E(V_0-E)}{V_0^2}\,e^{-2\kappa a}}$$

### (c) Numerical

$E=5$ eV, $V_0=10$ eV, $a=0.5$ nm, so $V_0-E = 5\ \text{eV}=8.01\times10^{-19}$ J.
$$\kappa = \frac{\sqrt{2(9.11\times10^{-31})(8.01\times10^{-19})}}{1.055\times10^{-34}} = \frac{1.208\times10^{-24}}{1.055\times10^{-34}} = \boxed{1.15\times10^{10}\ \text{m}^{-1}}$$
$$\kappa a = 1.1456\times10^{10}\times 5\times10^{-10} = 5.73 \quad(\gg1,\ \text{so the approximation is valid})$$
$$\frac{16E(V_0-E)}{V_0^2}=\frac{16\times5\times5}{100}=4,\qquad e^{-2\kappa a}=e^{-11.46}=1.06\times10^{-5}$$
$$\boxed{T\approx 4.2\times10^{-5}}$$
*(The exact formula in (a) gives $4.235\times10^{-5}$ — agreement to three figures, worth stating as a check.)*

### (d) Physics

Tunnelling explains **α-decay** (Gamow theory: the α particle escapes the nuclear Coulomb barrier), the **scanning tunnelling microscope**, the **tunnel (Esaki) diode**, cold field emission, and nuclear fusion in stars at sub-barrier energies.

Since $\kappa\propto\sqrt m$, $T\propto e^{-2a\sqrt{2m(V_0-E)}/\hbar}$ — the transmission falls **exponentially with the square root of the mass**. This is why electrons tunnel readily, protons far less, and macroscopic objects never.

---

## P4 — Harmonic oscillator by ladder operators

### (a) The algebra

Define
$$\hat a = \sqrt{\frac{m\omega}{2\hbar}}\left(\hat x + \frac{i\hat p}{m\omega}\right),\qquad \hat a^\dagger = \sqrt{\frac{m\omega}{2\hbar}}\left(\hat x - \frac{i\hat p}{m\omega}\right).$$

$$[\hat a,\hat a^\dagger] = \frac{m\omega}{2\hbar}\left[\hat x+\frac{i\hat p}{m\omega},\;\hat x-\frac{i\hat p}{m\omega}\right] = \frac{m\omega}{2\hbar}\cdot\frac{-2i}{m\omega}[\hat x,\hat p] = \frac{-i}{\hbar}(i\hbar) = \boxed{1}$$

Also
$$\hat a^\dagger\hat a = \frac{m\omega}{2\hbar}\left(\hat x^2+\frac{\hat p^2}{m^2\omega^2}\right) + \frac{i}{2\hbar}[\hat x,\hat p]\cdot(-1)\ \Rightarrow\ \hat H = \hbar\omega\left(\hat a^\dagger\hat a + \tfrac12\right) \equiv \hbar\omega\left(\hat N+\tfrac12\right).$$

$$[\hat H,\hat a^\dagger] = \hbar\omega[\hat a^\dagger\hat a,\hat a^\dagger] = \hbar\omega\,\hat a^\dagger[\hat a,\hat a^\dagger] = \boxed{\hbar\omega\,\hat a^\dagger},\qquad [\hat H,\hat a]=-\hbar\omega\,\hat a .$$

### (b) The spectrum

If $\hat H\psi = E\psi$, then
$$\hat H(\hat a^\dagger\psi) = \left(\hat a^\dagger\hat H + \hbar\omega\hat a^\dagger\right)\psi = (E+\hbar\omega)(\hat a^\dagger\psi),$$
so $\hat a^\dagger$ raises the energy by $\hbar\omega$; similarly $\hat a$ lowers it by $\hbar\omega$.

**Why the ladder terminates below.** For any normalised state,
$$\langle\psi|\hat H|\psi\rangle = \hbar\omega\left(\langle \hat a\psi|\hat a\psi\rangle + \tfrac12\right) \ge \frac{\hbar\omega}{2} > 0,$$
because $\|\hat a\psi\|^2\ge0$. So the energy is bounded below and repeated application of $\hat a$ must terminate: there exists $\psi_0$ with
$$\hat a\psi_0 = 0 \;\Longrightarrow\; \hat H\psi_0 = \hbar\omega\left(\hat a^\dagger\hat a+\tfrac12\right)\psi_0 = \tfrac12\hbar\omega\,\psi_0 .$$

Building up with $\hat a^\dagger$:
$$\boxed{\;E_n = \left(n+\tfrac12\right)\hbar\omega,\quad n = 0,1,2,\dots\;}$$
$n$ must be a **non-negative integer** because it counts applications of $\hat a^\dagger$ to $\psi_0$; a non-integer would let $\hat a$ generate a state with $\|\hat a\psi\|^2<0$, which is impossible.

Normalisation: $\hat a|n\rangle = \sqrt n\,|n-1\rangle$, $\hat a^\dagger|n\rangle=\sqrt{n+1}\,|n+1\rangle$, so $|n\rangle = \dfrac{(\hat a^\dagger)^n}{\sqrt{n!}}|0\rangle$.

**Zero-point energy.** $E_0=\tfrac12\hbar\omega\ne0$ — forced by the uncertainty principle; a state at rest at the origin would have $\Delta x=\Delta p=0$.

### (c) Ground-state wavefunction

$\hat a\psi_0=0$ reads
$$\left(\hat x+\frac{i\hat p}{m\omega}\right)\psi_0=0 \;\Longrightarrow\; \left(x + \frac{\hbar}{m\omega}\frac{d}{dx}\right)\psi_0 = 0 \;\Longrightarrow\; \frac{d\psi_0}{\psi_0} = -\frac{m\omega}{\hbar}x\,dx .$$
$$\psi_0 = N e^{-m\omega x^2/2\hbar},\qquad N^2\int_{-\infty}^\infty e^{-m\omega x^2/\hbar}dx = N^2\sqrt{\frac{\pi\hbar}{m\omega}} = 1$$
$$\boxed{\;\psi_0(x) = \left(\frac{m\omega}{\pi\hbar}\right)^{1/4} e^{-m\omega x^2/2\hbar}\;}$$

### (d) Moments and the virial theorem

Invert the definitions:
$$\hat x = \sqrt{\frac{\hbar}{2m\omega}}\left(\hat a+\hat a^\dagger\right),\qquad \hat p = i\sqrt{\frac{m\hbar\omega}{2}}\left(\hat a^\dagger-\hat a\right).$$

Then $\langle n|\hat x|n\rangle = 0$ and $\langle n|\hat p|n\rangle = 0$ (both $\hat a$ and $\hat a^\dagger$ change $n$, so the overlap vanishes).

$$\hat x^2 = \frac{\hbar}{2m\omega}\left(\hat a^2 + \hat a^{\dagger2} + \hat a\hat a^\dagger + \hat a^\dagger\hat a\right).$$
Only the last two survive in $\langle n|\cdots|n\rangle$: $\langle \hat a^\dagger\hat a\rangle = n$, $\langle \hat a\hat a^\dagger\rangle = n+1$.
$$\boxed{\langle x^2\rangle_n = \frac{\hbar}{2m\omega}(2n+1) = \left(n+\tfrac12\right)\frac{\hbar}{m\omega}}$$
Similarly
$$\boxed{\langle p^2\rangle_n = \frac{m\hbar\omega}{2}(2n+1) = \left(n+\tfrac12\right)m\hbar\omega}$$

**Virial theorem.**
$$\langle T\rangle = \frac{\langle p^2\rangle}{2m} = \frac{(n+\tfrac12)\hbar\omega}{2} = \frac{E_n}{2},\qquad \langle V\rangle = \frac12 m\omega^2\langle x^2\rangle = \frac{(n+\tfrac12)\hbar\omega}{2}=\frac{E_n}{2}.$$
$$\boxed{\langle T\rangle = \langle V\rangle = E_n/2}\quad\text{(consistent with } 2\langle T\rangle = \langle x\,dV/dx\rangle \text{ for } V\propto x^2).$$

**Uncertainty product.** $\Delta x = \sqrt{\langle x^2\rangle}$, $\Delta p=\sqrt{\langle p^2\rangle}$ since the means vanish:
$$\boxed{\Delta x\,\Delta p = \left(n+\tfrac12\right)\hbar}$$
Minimum $\hbar/2$ at $n=0$ — the ground state is a **minimum-uncertainty (Gaussian) state**, exactly as predicted by the saturation condition in P1(b).

---

## P5 — Angular momentum algebra

### (a) $[\hat L^2,\hat L_z]=0$

With $\hat L^2 = \hat L_x^2+\hat L_y^2+\hat L_z^2$ and $[\hat L_x,\hat L_y]=i\hbar\hat L_z$ (cyclic):
$$[\hat L_x^2,\hat L_z] = \hat L_x[\hat L_x,\hat L_z]+[\hat L_x,\hat L_z]\hat L_x = -i\hbar\left(\hat L_x\hat L_y+\hat L_y\hat L_x\right)$$
$$[\hat L_y^2,\hat L_z] = \hat L_y[\hat L_y,\hat L_z]+[\hat L_y,\hat L_z]\hat L_y = +i\hbar\left(\hat L_y\hat L_x+\hat L_x\hat L_y\right)$$
These cancel, and $[\hat L_z^2,\hat L_z]=0$. Hence
$$\boxed{[\hat L^2,\hat L_z]=0}$$
Commuting Hermitian operators possess a complete set of **simultaneous eigenfunctions**; label them $|\lambda,\mu\rangle$ with $\hat L^2|\lambda\mu\rangle=\lambda\hbar^2|\lambda\mu\rangle$, $\hat L_z|\lambda\mu\rangle = \mu\hbar|\lambda\mu\rangle$. Note $\hat L_x$ and $\hat L_y$ do **not** commute with $\hat L_z$, so only one component can be sharp at a time.

### (b) The ladder operators

$$[\hat L_z,\hat L_\pm] = [\hat L_z,\hat L_x]\pm i[\hat L_z,\hat L_y] = i\hbar\hat L_y \pm i(-i\hbar \hat L_x) = \pm\hbar\left(\hat L_x\pm i\hat L_y\right) = \boxed{\pm\hbar\hat L_\pm}$$
Also $[\hat L^2,\hat L_\pm]=0$.

Therefore
$$\hat L_z\left(\hat L_\pm|\lambda\mu\rangle\right) = \left(\hat L_\pm\hat L_z \pm\hbar\hat L_\pm\right)|\lambda\mu\rangle = (\mu\pm1)\hbar\left(\hat L_\pm|\lambda\mu\rangle\right),$$
while $\hat L^2$ is unchanged. So $\hat L_\pm$ shifts $\mu$ by $\pm1$ within a fixed $\lambda$.

### (c) Eigenvalues from termination

Useful identity:
$$\hat L_\mp \hat L_\pm = \hat L^2 - \hat L_z^2 \mp \hbar\hat L_z .$$

Since $\hat L^2 - \hat L_z^2 = \hat L_x^2+\hat L_y^2$ is a sum of squares of Hermitian operators, $\langle \hat L^2 - \hat L_z^2\rangle \ge 0$, i.e. $\mu^2 \le \lambda$. So $\mu$ is **bounded above and below**, and the ladder must terminate at both ends. Let $\mu_{\max}=\ell$ and $\mu_{\min}=\ell'$:
$$\hat L_+|\lambda,\ell\rangle = 0 \;\Rightarrow\; \hat L_-\hat L_+|\lambda\ell\rangle = \left(\lambda - \ell^2 - \ell\right)\hbar^2|\lambda\ell\rangle = 0 \;\Rightarrow\; \lambda = \ell(\ell+1).$$
$$\hat L_-|\lambda,\ell'\rangle=0 \;\Rightarrow\; \lambda = \ell'(\ell'-1).$$
Equating: $\ell(\ell+1)=\ell'(\ell'-1) \Rightarrow \ell' = -\ell$ (rejecting $\ell'=\ell+1 > \ell$).

Since one climbs from $\mu=-\ell$ to $\mu=+\ell$ in unit steps, $2\ell$ must be a non-negative **integer**, so $\ell = 0,\tfrac12,1,\tfrac32,\dots$

$$\boxed{\;\hat L^2|\ell m\rangle = \ell(\ell+1)\hbar^2|\ell m\rangle,\qquad \hat L_z|\ell m\rangle = m\hbar|\ell m\rangle,\quad m=-\ell,\dots,+\ell\;}$$
$(2\ell+1)$ values of $m$ for each $\ell$.

Normalisation of the ladder:
$$\hat L_\pm|\ell m\rangle = \hbar\sqrt{\ell(\ell+1)-m(m\pm1)}\;|\ell,m\pm1\rangle .$$

**Why orbital $\ell$ must be integral.** For *orbital* angular momentum, $\hat L_z=-i\hbar\,\partial/\partial\phi$ and the eigenfunction is $e^{im\phi}$. Single-valuedness under $\phi\to\phi+2\pi$ forces $e^{2\pi i m}=1$, i.e. $m\in\mathbb Z$ and hence $\ell\in\mathbb Z$. The half-integral solutions permitted by the *algebra* are realised only by **spin**, which has no coordinate representation and is therefore not subject to the single-valuedness argument.

---

## P6 — Hydrogen atom

### (a) Separation

$$-\frac{\hbar^2}{2\mu}\nabla^2\psi + V(r)\psi = E\psi,\qquad V(r)=-\frac{e^2}{4\pi\varepsilon_0 r}$$
($\mu$ = reduced mass of the electron–proton system; say so — UPSC gives a mark for it.)

In spherical coordinates,
$$\nabla^2 = \frac{1}{r^2}\frac{\partial}{\partial r}\left(r^2\frac{\partial}{\partial r}\right) - \frac{\hat L^2}{\hbar^2 r^2}.$$
Because $V$ depends only on $r$, put $\psi = R(r)\,Y_{\ell m}(\theta,\phi)$, with $\hat L^2 Y_{\ell m}=\ell(\ell+1)\hbar^2 Y_{\ell m}$. Substituting $u(r)=rR(r)$ gives the **radial equation**:
$$\boxed{\;-\frac{\hbar^2}{2\mu}\frac{d^2u}{dr^2} + \underbrace{\left[-\frac{e^2}{4\pi\varepsilon_0 r} + \frac{\hbar^2\ell(\ell+1)}{2\mu r^2}\right]}_{V_{\text{eff}}(r)}u = Eu\;}$$
— formally a 1-D problem with a **centrifugal barrier**, exactly parallel to the classical central-force reduction you drilled on 2026-06-23.

### (b) Energies and $a_0$

Let $\kappa=\sqrt{-2\mu E}/\hbar$ (bound states, $E<0$) and $\rho=\kappa r$. Then
$$\frac{d^2u}{d\rho^2} = \left[1 - \frac{\rho_0}{\rho} + \frac{\ell(\ell+1)}{\rho^2}\right]u,\qquad \rho_0=\frac{\mu e^2}{2\pi\varepsilon_0\hbar^2\kappa}.$$
Asymptotics: $u\sim e^{-\rho}$ as $\rho\to\infty$; $u\sim\rho^{\ell+1}$ as $\rho\to0$. Write $u=\rho^{\ell+1}e^{-\rho}v(\rho)$ and solve by a power series. The series **must terminate** (otherwise $v\sim e^{2\rho}$ and $u$ blows up), and the termination condition is
$$\rho_0 = 2n,\qquad n = j_{\max}+\ell+1 \in \{1,2,3,\dots\},\quad \ell\le n-1 .$$

From $\rho_0=2n$:
$$\kappa = \frac{\mu e^2}{4\pi\varepsilon_0\hbar^2 n} = \frac{1}{n a_0},\qquad \boxed{a_0 = \frac{4\pi\varepsilon_0\hbar^2}{\mu e^2} = 0.529\ \text{Å}}$$
and since $E=-\hbar^2\kappa^2/2\mu$,
$$\boxed{\;E_n = -\frac{\mu}{2\hbar^2}\left(\frac{e^2}{4\pi\varepsilon_0}\right)^{\!2}\frac{1}{n^2} = -\frac{13.6\ \text{eV}}{n^2}\;}$$

### (c) Degeneracy

For a given $n$: $\ell = 0,1,\dots,n-1$, and for each $\ell$ there are $(2\ell+1)$ values of $m$:
$$\sum_{\ell=0}^{n-1}(2\ell+1) = 2\cdot\frac{(n-1)n}{2} + n = \boxed{n^2}$$
Including the two spin states, $\boxed{2n^2}$.

The $m$-degeneracy follows from **rotational symmetry** (true for any central potential). The extra $\ell$-**degeneracy** is special to the $1/r$ potential — an "accidental" degeneracy traceable to the conserved **Runge–Lenz vector**, i.e. an extra $SO(4)$ dynamical symmetry. Any deviation from pure $1/r$ (screening in multi-electron atoms, relativistic corrections, the Lamb shift) lifts it. *Say this — it is a frequent follow-up.*

### (d) $\langle r\rangle$ vs most probable radius

Ground state $\psi_{100}=\dfrac{1}{\sqrt{\pi a_0^3}}e^{-r/a_0}$.

$$\langle r\rangle = \int |\psi|^2 r\,d^3r = \frac{1}{\pi a_0^3}\int_0^\infty e^{-2r/a_0}\,r\cdot 4\pi r^2\,dr = \frac{4}{a_0^3}\int_0^\infty r^3 e^{-2r/a_0}dr .$$
Using $\int_0^\infty r^n e^{-\alpha r}dr = n!/\alpha^{n+1}$ with $\alpha=2/a_0$, $n=3$: $= \dfrac{6}{(2/a_0)^4}=\dfrac{6a_0^4}{16}$.
$$\langle r\rangle = \frac{4}{a_0^3}\cdot\frac{6a_0^4}{16} = \boxed{\frac{3a_0}{2}}$$
(consistent with the general formula $\langle r\rangle_{n\ell}=\frac{a_0}{2}[3n^2-\ell(\ell+1)]$ at $n=1,\ell=0$ ✓).

**Most probable radius.** The radial probability density is $P(r)=r^2|R_{10}|^2 = \dfrac{4}{a_0^3}r^2e^{-2r/a_0}$.
$$\frac{dP}{dr} = \frac{4}{a_0^3}\left(2r - \frac{2r^2}{a_0}\right)e^{-2r/a_0} = 0 \;\Longrightarrow\; \boxed{r_{\text{mp}} = a_0}$$

**Why they differ:** $P(r)$ is **not symmetric** — it rises as $r^2$ and falls as $e^{-2r/a_0}$, giving a long tail to large $r$. The mean of a right-skewed distribution lies above its mode, hence $\langle r\rangle = 1.5a_0 > r_{\text{mp}}=a_0$. Note also that $|\psi|^2$ itself is *maximum at the origin*; it is the $4\pi r^2$ volume factor that pushes the peak of $P(r)$ out to $a_0$. State both points.

---

## P7 — Time-independent perturbation theory

### (a) The expansion

Write $\hat H = \hat H^{(0)} + \lambda\hat H'$, and expand
$$|n\rangle = |n^{(0)}\rangle + \lambda|n^{(1)}\rangle + \lambda^2|n^{(2)}\rangle+\cdots,\qquad E_n = E_n^{(0)}+\lambda E_n^{(1)}+\lambda^2E_n^{(2)}+\cdots$$
Substitute into $\hat H|n\rangle = E_n|n\rangle$ and collect powers of $\lambda$.

**Order $\lambda^1$:**
$$\hat H^{(0)}|n^{(1)}\rangle + \hat H'|n^{(0)}\rangle = E_n^{(0)}|n^{(1)}\rangle + E_n^{(1)}|n^{(0)}\rangle .$$
Take $\langle n^{(0)}|$ of both sides; the first terms cancel by Hermiticity of $\hat H^{(0)}$:
$$\boxed{E_n^{(1)} = \langle n^{(0)}|\hat H'|n^{(0)}\rangle}$$
Taking $\langle k^{(0)}|$ ($k\ne n$) instead gives the state correction:
$$\boxed{|n^{(1)}\rangle = \sum_{k\ne n}\frac{\langle k^{(0)}|\hat H'|n^{(0)}\rangle}{E_n^{(0)}-E_k^{(0)}}\,|k^{(0)}\rangle}$$

**Order $\lambda^2$:** projecting on $\langle n^{(0)}|$ and using the above,
$$\boxed{E_n^{(2)} = \sum_{k\ne n}\frac{\left|\langle k^{(0)}|\hat H'|n^{(0)}\rangle\right|^2}{E_n^{(0)}-E_k^{(0)}}}$$

**Validity condition** (state it): $\left|\langle k|\hat H'|n\rangle\right| \ll \left|E_n^{(0)}-E_k^{(0)}\right|$ — which is why the method fails for degenerate levels and one must use degenerate PT.

### (b) Sign of the ground-state second-order shift

For $n=0$, every denominator $E_0^{(0)}-E_k^{(0)} < 0$ (the ground state is the lowest), while every numerator is $|\cdot|^2 \ge 0$. Hence
$$\boxed{E_0^{(2)} \le 0}$$
— the second-order correction always **pushes the ground state down**. (Physically the same statement as the variational principle: mixing in excited states can only lower the ground-state energy.)

### (c) Charged oscillator in a uniform field

$\hat H' = -q\mathcal E\hat x$, with $\hat x = \sqrt{\dfrac{\hbar}{2m\omega}}(\hat a+\hat a^\dagger)$.

**First order:** $\langle n|\hat x|n\rangle=0$ (as in P4d), so
$$\boxed{E_n^{(1)}=0}$$

**Second order:** the only non-zero matrix elements are
$$\langle n\pm1|\hat x|n\rangle = \sqrt{\frac{\hbar}{2m\omega}}\times\begin{cases}\sqrt{n+1} & (+)\\ \sqrt n & (-)\end{cases}$$
with denominators $E_n-E_{n+1}=-\hbar\omega$ and $E_n-E_{n-1}=+\hbar\omega$:
$$E_n^{(2)} = q^2\mathcal E^2\frac{\hbar}{2m\omega}\left[\frac{n+1}{-\hbar\omega} + \frac{n}{+\hbar\omega}\right] = \frac{q^2\mathcal E^2\hbar}{2m\omega}\cdot\frac{-1}{\hbar\omega}$$
$$\boxed{E_n^{(2)} = -\frac{q^2\mathcal E^2}{2m\omega^2}}$$
Note it is **independent of $n$** — every level shifts by the same amount, so the spectrum is rigidly translated and the transition frequencies are unchanged.

**Exact check (complete the square).**
$$\hat H = \frac{\hat p^2}{2m}+\frac12 m\omega^2 x^2 - q\mathcal E x = \frac{\hat p^2}{2m}+\frac12 m\omega^2\left(x-\frac{q\mathcal E}{m\omega^2}\right)^{\!2} - \frac{q^2\mathcal E^2}{2m\omega^2}.$$
This is a harmonic oscillator in the shifted variable $x' = x - q\mathcal E/m\omega^2$, so exactly
$$E_n = \left(n+\tfrac12\right)\hbar\omega - \frac{q^2\mathcal E^2}{2m\omega^2}.$$
The perturbation series **terminates at second order** and reproduces the exact answer ✓. This is a favourite UPSC "verify your result" part — always do it.

### (d) Anharmonic $\lambda x^4$

$$E_n^{(1)} = \lambda\langle n|\hat x^4|n\rangle,\qquad \hat x^4 = \left(\frac{\hbar}{2m\omega}\right)^{\!2}(\hat a+\hat a^\dagger)^4 .$$
In the expansion of $(\hat a+\hat a^\dagger)^4$ only the terms with two $\hat a$'s and two $\hat a^\dagger$'s survive the diagonal matrix element. There are six such orderings; evaluating each on $|n\rangle$:

| term | value |
|---|---|
| $\hat a\hat a\hat a^\dagger\hat a^\dagger$ | $(n+1)(n+2)$ |
| $\hat a\hat a^\dagger\hat a\hat a^\dagger$ | $(n+1)^2$ |
| $\hat a\hat a^\dagger\hat a^\dagger\hat a$ | $n(n+1)$ |
| $\hat a^\dagger\hat a\hat a\hat a^\dagger$ | $n(n+1)$ |
| $\hat a^\dagger\hat a\hat a^\dagger\hat a$ | $n^2$ |
| $\hat a^\dagger\hat a^\dagger\hat a\hat a$ | $n(n-1)$ |

Sum $= (n^2+3n+2)+(n^2+2n+1)+2(n^2+n)+n^2+(n^2-n) = 6n^2+6n+3 = 3(2n^2+2n+1)$.

$$\boxed{\;E_n^{(1)} = 3\lambda\left(\frac{\hbar}{2m\omega}\right)^{2}\left(2n^2+2n+1\right)\;}$$

Check $n=0$: $3\lambda(\hbar/2m\omega)^2$, matching the standard Gaussian integral $\langle 0|x^4|0\rangle = 3\langle 0|x^2|0\rangle^2$ ✓.

---

## P8 — Spin-½ and Stern–Gerlach

### (a) Pauli algebra

$$\sigma_x = \begin{pmatrix}0&1\\1&0\end{pmatrix},\quad \sigma_y=\begin{pmatrix}0&-i\\i&0\end{pmatrix},\quad \sigma_z=\begin{pmatrix}1&0\\0&-1\end{pmatrix},\qquad \hat{\mathbf S}=\frac{\hbar}{2}\boldsymbol\sigma .$$

Direct multiplication gives $\sigma_x^2=\sigma_y^2=\sigma_z^2=I$ and $\sigma_x\sigma_y = iI\!\cdot\!\sigma_z$ etc. Combining:
$$\boxed{\sigma_i\sigma_j = \delta_{ij}I + i\epsilon_{ijk}\sigma_k}$$
Adding and subtracting the same relation with $i\leftrightarrow j$:
$$[\sigma_i,\sigma_j] = 2i\epsilon_{ijk}\sigma_k \quad\Rightarrow\quad [\hat S_i,\hat S_j]=i\hbar\epsilon_{ijk}\hat S_k \ \checkmark,\qquad \{\sigma_i,\sigma_j\}=2\delta_{ij}I .$$
Also $\hat S^2 = \tfrac{3}{4}\hbar^2 I = s(s+1)\hbar^2$ with $s=\tfrac12$ ✓ — the half-integral case allowed by the P5 algebra.

### (b) Eigenspinors of $\hat{\mathbf S}\cdot\hat n$

$$\hat{\mathbf S}\cdot\hat n = \frac{\hbar}{2}\begin{pmatrix}\cos\theta & \sin\theta\,e^{-i\phi}\\ \sin\theta\,e^{i\phi} & -\cos\theta\end{pmatrix}$$
Characteristic equation: $\lambda^2 - \left(\frac{\hbar}{2}\right)^2\left(\cos^2\theta+\sin^2\theta\right)=0$, so
$$\boxed{\lambda = \pm\hbar/2}$$
(as it must be — every direction is equivalent).

For $\lambda=+\hbar/2$, solving $(\cos\theta - 1)a + \sin\theta e^{-i\phi}b = 0$ and using half-angle identities $1-\cos\theta = 2\sin^2\frac\theta2$, $\sin\theta = 2\sin\frac\theta2\cos\frac\theta2$:
$$\frac{b}{a} = \frac{1-\cos\theta}{\sin\theta}e^{i\phi} = \tan\frac{\theta}{2}\,e^{i\phi}$$
$$\boxed{\chi_+^{(\hat n)} = \begin{pmatrix}\cos\frac{\theta}{2}\\[4pt] \sin\frac{\theta}{2}\,e^{i\phi}\end{pmatrix},\qquad \chi_-^{(\hat n)} = \begin{pmatrix}-\sin\frac{\theta}{2}\,e^{-i\phi}\\[4pt] \cos\frac{\theta}{2}\end{pmatrix}}$$
(orthonormal ✓).

### (c) Sequential Stern–Gerlach

The state entering the second analyser is $\chi = \binom{1}{0}$ (spin-up along $z$). The amplitude for the outcome $+\hbar/2$ along $\hat n$ is
$$\left\langle \chi_+^{(\hat n)}\Big|\chi\right\rangle = \left(\cos\tfrac\theta2,\ \sin\tfrac\theta2 e^{-i\phi}\right)\binom{1}{0} = \cos\frac\theta2 .$$
$$\boxed{P_+ = \cos^2\frac{\theta}{2},\qquad P_- = \sin^2\frac{\theta}{2}},\qquad P_++P_-=1\ \checkmark$$

- $\theta = 0$: $P_+=1$ — a repeated identical measurement reproduces the result (consistency of the projection postulate).
- $\theta = 60^\circ$: $P_+=\cos^2 30^\circ = \boxed{3/4 = 0.75}$, $P_-=0.25$.
- $\theta = 90^\circ$: $P_+=\cos^2 45^\circ = \boxed{1/2}$ — an $S_z$ eigenstate is a *superposition* of $S_x$ eigenstates in equal measure, the direct experimental content of $[\hat S_x,\hat S_z]\ne0$.

### (d) What Stern–Gerlach established

The silver beam split into **exactly two** components. Two facts follow that the old quantum theory could not accommodate:

1. **Space quantisation is real** — the magnetic moment takes discrete orientations, not a continuous distribution.
2. **The multiplicity is even ($2j+1=2 \Rightarrow j=\tfrac12$)**, which is impossible for orbital angular momentum, where $2\ell+1$ is always odd. Silver's outer electron is in an $\ell=0$ state, so the splitting cannot be orbital at all. This forced the introduction of an intrinsic, half-integral **spin** with $g\approx2$ — a purely quantum degree of freedom with no classical analogue.

---

## Recurring-pattern insights

**1. UPSC's QM questions cluster around four "engines," and almost every question is one engine plus a dressing.** The engines are: (i) *solve-and-match* — write the general solution in each region, impose continuity of $\psi$ and $\psi'$, extract a quantisation or transmission condition (box, step, barrier, finite well, delta well); (ii) *ladder algebra* — SHO and angular momentum, both solved by the same trick of a commutator plus a termination argument; (iii) *perturbation theory* — write $H'$, compute a diagonal matrix element, and if it vanishes by parity go to second order; (iv) *expectation values and commutators* — Ehrenfest, virial, uncertainty. If you can execute those four cleanly you can attempt roughly 70% of the QM section without having memorised any specific problem. Practise the *engines*, not the problem list.

**2. The "vanishing first-order correction" is the single most reliable trap-and-reward in the perturbation questions.** Whenever $H'$ is odd under the symmetry of the unperturbed state — $H'=-q\mathcal Ex$ on an SHO, or the linear Stark effect on hydrogen's ground state — the first-order shift is *zero by parity*, and the whole question is really testing whether you (a) notice this, (b) say so explicitly with the parity argument, and (c) proceed to second order. Candidates who grind out the integral instead of quoting parity lose time and marks. The complementary case is the **linear Stark effect for $n=2$ hydrogen**, where the $2s$ and $2p_0$ states are degenerate and *degenerate* PT gives a non-zero first-order splitting $\pm3ea_0\mathcal E$ — expect one or the other most years.

**3. Marks are concentrated in the setup, not the algebra.** In the barrier problem the four continuity equations are worth more than the messy elimination; in hydrogen the separation of variables and the statement of the effective potential are worth more than the Laguerre series. UPSC's model answers reward: stating boundary conditions, justifying dropped terms (no left-moving wave in region III; series must terminate or $u$ diverges), naming the physical origin of a result (the $\ell$-degeneracy is a $1/r$ accident), and drawing the figure. Write these lines even when short on time — a well-set-up incomplete answer routinely outscores a bare correct formula.

---

## Tip of the week

**Build a one-page "commutator and matrix-element sheet" and rehearse it until it is automatic.** Nearly every QM question in Paper II bottoms out in one of about a dozen objects: $[\hat x,\hat p]$, $[\hat H,\hat x]$, $[\hat H,\hat p]$, $[\hat a,\hat a^\dagger]$, $[\hat L_i,\hat L_j]$, $[\hat L^2,\hat L_z]$, $[\hat L_z,\hat L_\pm]$, $[\sigma_i,\sigma_j]$, plus $\langle n|\hat x|n\pm1\rangle$, $\langle n|\hat x^2|n\rangle$, $\hat L_\pm|\ell m\rangle$ and the hydrogen $\langle r^k\rangle$ table. In the exam you will not have time to *derive* $\langle n|x|n+1\rangle=\sqrt{(n+1)\hbar/2m\omega}$ in the middle of a perturbation problem — you need it the way you need $\sin^2+\cos^2=1$. Write the sheet once by hand, then every morning this week reproduce it from memory in under five minutes before starting the problems. This one page will save you 15–20 minutes across the actual paper, which is the difference between attempting seven questions and attempting eight.

---

## Next week (preview)

**Quantum Mechanics Part 2** — the finite square well and delta-function potential, the WKB approximation and its application to α-decay, scattering theory (partial waves, Born approximation, phase shifts), identical particles and exchange symmetry, and time-dependent perturbation theory with Fermi's golden rule. That closes the QM block, after which the rotation moves to **Atomic & Molecular Physics** (which will lean directly on this week's angular momentum algebra and perturbation theory).
