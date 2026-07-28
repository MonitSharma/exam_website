# Physics Optional PYQ Plan — week of 2026-07-28

**Paper I · Thermodynamics & Statistical Mechanics · Topic: Thermodynamic Potentials, Phase Transitions & Quantum Statistics**

> **Why this topic now:** Last week (`2026-07-21`) closed the **F4 Optics fortnight** with lasers, fibres and holography. That completed Mechanics ✅, Electrodynamics ✅ and Optics ✅ — leaving **Thermodynamics & Statistical Mechanics** as the *last untouched Paper I block*. This is exactly the F5 slot (28 Jul – 10 Aug) flagged in last week's plan. Finish this and **Paper I is covered end-to-end**, after which the rotation moves entirely into Paper II.

**Rotation tracker — Paper I:** Mechanics (Lagrangian/Hamiltonian ✅, central force ✅, rigid body ✅) · Electrodynamics ✅ · Optics Part 1 ✅ · Optics Part 2 ✅ · **Thermo & Stat Mech (this week)** → *Paper I complete.*
**Next up (F6, 11–24 Aug onwards) — Paper II, untouched:** Quantum Mechanics · Atomic & Molecular · Nuclear & Particle · Solid State · Electronics · Special Relativity.

---

## How to use this set (timed)

1. **Attempt closed-book, ~100 minutes.** Treat **P1, P5, P7** as 20-markers, **P2, P4, P6, P8** as 15-markers, **P3** as a 10–15-mark derivation-plus-numerical.
2. **Always state the ensemble and the assumptions.** In this section UPSC awards marks explicitly for *"assuming the vapour behaves as an ideal gas and $v_g \gg v_\ell$"*, *"in the thermodynamic limit"*, *"for spinless bosons, $\mu \to 0$"*, etc. Skipping these costs 2–3 marks per question even when the algebra is perfect.
3. Sketch the graph wherever one exists — $u(\nu)$ vs $\nu$ (P5), $N_0/N$ vs $T$ (P6), $C_{el}$ and $C$ vs $T$ (P7), the Schottky bump (P8). These are cheap marks.
4. **Then** check against the worked solutions and log every boxed result into your **Formula & Derivation Master Log** under *"Thermo & Stat Mech."*
5. **Source the real papers yourself:** UPSC official site (`upsc.gov.in` → *Examination → Previous Year Question Papers*) → download the **Physics Paper I** PDFs across the last ~20 years. Search each for `"Maxwell's thermodynamic relations"`, `"Clausius-Clapeyron"`, `"Joule-Thomson"`, `"inversion temperature"`, `"partition function"`, `"Sackur-Tetrode"`, `"Gibbs paradox"`, `"Planck's law"`, `"Stefan-Boltzmann"`, `"Wien's displacement"`, `"Bose-Einstein condensation"`, `"Fermi energy"`, `"electronic specific heat"`, `"Schottky"`. Texts that mirror UPSC phrasing: **Zemansky & Dittman, *Heat and Thermodynamics*** (classical half — the closest match to UPSC's wording), **Pathria & Beale, *Statistical Mechanics***, **R. K. Srivastava / Sears & Salinger**, and **B. B. Laud, *Statistical Mechanics*** for the Indian-syllabus derivations and numericals.

> ⚠️ **Honesty note:** The 8 problems below are **representative UPSC-style** items built on the exact derivations and numericals UPSC repeats in this section. They are **not** claimed to be verbatim past questions — treat the specific wording as mine, not UPSC's. Pull the actual Paper I PDFs from `upsc.gov.in` for exact phrasing and mark allocation. **Never treat these as the real paper.**

---

## Problems (representative UPSC-style — closed-book attempt first)

**P1 (the perennial 20-marker).**
(a) Starting from the first and second laws, define the four thermodynamic potentials $U, H, F, G$ and write their natural differentials.
(b) Derive the **four Maxwell relations**.
(c) Derive the two **TdS equations**.
(d) Hence prove the general result
$$C_P - C_V = \frac{TV\beta^2}{\kappa_T},$$
where $\beta$ is the volume expansivity and $\kappa_T$ the isothermal compressibility. Verify it reduces to $C_P - C_V = nR$ for an ideal gas, and comment on the sign of $C_P - C_V$ for *any* substance.

**P2 (first-order phase transitions).**
(a) Using the equality of the specific Gibbs functions of two coexisting phases, derive the **Clausius–Clapeyron equation** $\dfrac{dP}{dT} = \dfrac{L}{T\,\Delta v}$.
(b) For a liquid–vapour transition, making the standard approximations, integrate it to obtain $\ln P = -\dfrac{L_m}{RT} + \text{const}$.
(c) **Numerical:** For water at $100^\circ$C, $L_m = 40.65\ \text{kJ mol}^{-1}$. Estimate $dP/dT$ along the coexistence curve, and hence the boiling point at an altitude where the ambient pressure has fallen by $11\ \text{kPa}$.
(d) State how the argument fails for a *second-order* transition and write down the **Ehrenfest equations** instead.

**P3 (Joule–Thomson).**
(a) Show that the throttling process is **isenthalpic**, and derive the Joule–Thomson coefficient
$$\mu_{JT} = \left(\frac{\partial T}{\partial P}\right)_H = \frac{1}{C_P}\left[T\left(\frac{\partial V}{\partial T}\right)_P - V\right] = \frac{V}{C_P}\left(T\beta - 1\right).$$
(b) Show $\mu_{JT} = 0$ for an ideal gas.
(c) For a van der Waals gas, working to **first order** in $a$ and $b$, show that $\mu_{JT} = \dfrac{1}{C_P}\left(\dfrac{2a}{RT} - b\right)$ and hence that the **inversion temperature** is $T_i = \dfrac{2a}{Rb}$.
(d) **Numerical:** evaluate $T_i$ for CO$_2$ ($a = 0.364\ \text{Pa m}^6\text{mol}^{-2}$, $b = 4.27\times10^{-5}\ \text{m}^3\text{mol}^{-1}$) and for H$_2$ ($a = 0.0248$, $b = 2.66\times10^{-5}$ in the same units). Explain the practical consequence for liquefying hydrogen.

**P4 (classical partition function).**
(a) For a monatomic ideal gas of $N$ indistinguishable particles in volume $V$, evaluate the single-particle partition function $z$ and hence $Z_N$.
(b) Obtain the Helmholtz free energy and derive the **equation of state**, the internal energy, and the **Sackur–Tetrode entropy**
$$S = Nk_B\left[\ln\!\left(\frac{V}{N}\left(\frac{2\pi m k_B T}{h^2}\right)^{3/2}\right) + \frac52\right].$$
(c) State the **Gibbs paradox** and explain precisely how the factor $1/N!$ resolves it.

**P5 (blackbody radiation — 20-marker).**
(a) Treating the radiation field as a photon gas obeying **Bose–Einstein statistics with $\mu = 0$**, and deriving the density of modes, obtain **Planck's radiation law**
$$u(\nu)\,d\nu = \frac{8\pi h\nu^3}{c^3}\,\frac{d\nu}{e^{h\nu/k_BT}-1}.$$
(b) Recover the **Rayleigh–Jeans** and **Wien** limits, and state the ultraviolet catastrophe.
(c) Integrate to obtain the **Stefan–Boltzmann law** and express $\sigma$ in terms of fundamental constants.
(d) Derive **Wien's displacement law** $\lambda_{\max}T = \text{const}$ and evaluate the constant.

**P6 (Bose–Einstein condensation).**
(a) For an ideal gas of non-relativistic spinless bosons of mass $m$, write $N$ as a sum of the ground-state occupation and the integral over excited states.
(b) Show that below a critical temperature
$$T_c = \frac{2\pi\hbar^2}{m k_B}\left(\frac{n}{\zeta(3/2)}\right)^{2/3}, \qquad \zeta(3/2) = 2.612,$$
a macroscopic fraction occupies the ground state, and derive $N_0/N = 1 - (T/T_c)^{3/2}$.
(c) **Numerical:** estimate $T_c$ for liquid $^4$He, taking $n = 2.2\times10^{28}\ \text{m}^{-3}$ and $m = 6.65\times10^{-27}\ \text{kg}$. Compare with the observed $\lambda$-point at $2.17\ \text{K}$ and comment on the discrepancy.

**P7 (degenerate Fermi gas — 20-marker).**
(a) For a free-electron gas at $T = 0$, derive the density of states $g(E)$ and hence the **Fermi energy** $E_F = \dfrac{\hbar^2}{2m}(3\pi^2 n)^{2/3}$.
(b) Show that the mean energy per electron is $\tfrac35 E_F$ and the **degeneracy pressure** is $P = \tfrac25 nE_F$.
(c) Quote the **Sommerfeld** result for the electronic specific heat, $C_{el} = \dfrac{\pi^2}{2}Nk_B\dfrac{T}{T_F}$, and explain physically why it is linear in $T$ and so much smaller than the classical $\tfrac32 Nk_B$.
(d) **Numerical:** for copper ($n = 8.5\times10^{28}\ \text{m}^{-3}$) find $E_F$ in eV, the Fermi temperature, and the ratio of the electronic to the lattice (Dulong–Petit) specific heat at $300\ \text{K}$.

**P8 (canonical ensemble, paramagnetism & fluctuations).**
(a) For $N$ non-interacting spin-$\tfrac12$ magnetic dipoles of moment $\mu$ in a field $B$, evaluate the partition function and derive the magnetisation $M = N\mu\tanh(\mu B/k_BT)$. Obtain the **Curie law** in the weak-field limit.
(b) Obtain the heat capacity and show it has a maximum (the **Schottky anomaly**); sketch $C$ vs $T$ and explain the low- and high-$T$ behaviour.
(c) Prove the general canonical-ensemble result $\langle (\Delta E)^2\rangle = k_BT^2C_V$, and hence show that the relative energy fluctuation vanishes as $N^{-1/2}$ — the reason the canonical and microcanonical ensembles agree in the thermodynamic limit.

---

## Key formulas used (quote these cold)

| # | Formula | Meaning |
|---|---|---|
| 1 | $dU = TdS - PdV$; $dH = TdS + VdP$; $dF = -SdT - PdV$; $dG = -SdT + VdP$ | the four potentials |
| 2 | $\left(\frac{\partial S}{\partial V}\right)_T = \left(\frac{\partial P}{\partial T}\right)_V$, $\left(\frac{\partial S}{\partial P}\right)_T = -\left(\frac{\partial V}{\partial T}\right)_P$ | the two *useful* Maxwell relations |
| 3 | $TdS = C_VdT + T\left(\frac{\partial P}{\partial T}\right)_VdV$; $TdS = C_PdT - T\left(\frac{\partial V}{\partial T}\right)_PdP$ | the TdS equations |
| 4 | $C_P - C_V = TV\beta^2/\kappa_T$ | general; $\beta=\frac1V(\partial V/\partial T)_P$, $\kappa_T=-\frac1V(\partial V/\partial P)_T$ |
| 5 | $dP/dT = L/(T\Delta v)$ | Clausius–Clapeyron |
| 6 | $\mu_{JT} = \frac{1}{C_P}\left[T(\partial V/\partial T)_P - V\right]$; $T_i = 2a/Rb$ | Joule–Thomson, vdW inversion |
| 7 | $z = V/\lambda^3$, $\lambda = h/\sqrt{2\pi mk_BT}$, $Z_N = z^N/N!$ | ideal gas partition function ($\lambda$ = thermal de Broglie wavelength) |
| 8 | $F = -k_BT\ln Z$; $S=-(\partial F/\partial T)_V$; $P=-(\partial F/\partial V)_T$; $U = -\partial\ln Z/\partial\beta$ | the standard extraction chain |
| 9 | $u(\nu)d\nu = \frac{8\pi h\nu^3}{c^3}\frac{d\nu}{e^{h\nu/k_BT}-1}$ | Planck's law |
| 10 | $E = \sigma T^4$, $\sigma = \frac{2\pi^5k_B^4}{15c^2h^3} = 5.67\times10^{-8}\ \text{W m}^{-2}\text{K}^{-4}$ | Stefan–Boltzmann |
| 11 | $\lambda_{\max}T = hc/(4.965\,k_B) = 2.898\times10^{-3}\ \text{m K}$ | Wien displacement |
| 12 | $n\lambda^3 = \zeta(3/2) = 2.612$ at $T_c$; $N_0/N = 1-(T/T_c)^{3/2}$ | BEC condition & condensate fraction |
| 13 | $E_F = \frac{\hbar^2}{2m}(3\pi^2n)^{2/3}$; $\bar E = \tfrac35E_F$; $P = \tfrac25 nE_F$ | degenerate Fermi gas at $T=0$ |
| 14 | $C_{el} = \frac{\pi^2}{2}Nk_B(T/T_F)$; $C = \gamma T + AT^3$ | Sommerfeld electronic + Debye lattice |
| 15 | $\langle(\Delta E)^2\rangle = k_BT^2C_V$ | canonical energy fluctuation |

**Constants:** $k_B = 1.381\times10^{-23}$ J K$^{-1}$ · $h = 6.626\times10^{-34}$ J s · $\hbar = 1.055\times10^{-34}$ J s · $R = 8.314$ J mol$^{-1}$K$^{-1}$ · $m_e = 9.109\times10^{-31}$ kg · $1\ \text{eV} = 1.602\times10^{-19}$ J.

---

## Worked solutions

### P1 — Potentials, Maxwell relations, TdS equations, $C_P-C_V$

**(a) The potentials.** Combining the first law $dU = \delta Q - PdV$ with the second law for a reversible path $\delta Q = TdS$:
$$dU = T\,dS - P\,dV.$$
Legendre-transforming to change the independent variables:

| Potential | Definition | Differential | Natural variables |
|---|---|---|---|
| Internal energy | $U$ | $dU = TdS - PdV$ | $(S,V)$ |
| Enthalpy | $H = U+PV$ | $dH = TdS + VdP$ | $(S,P)$ |
| Helmholtz free energy | $F = U-TS$ | $dF = -SdT - PdV$ | $(T,V)$ |
| Gibbs free energy | $G = H-TS$ | $dG = -SdT + VdP$ | $(T,P)$ |

**(b) Maxwell relations.** Each differential is exact, so mixed second partials commute. From $dU$: $\left(\frac{\partial T}{\partial V}\right)_S = -\left(\frac{\partial P}{\partial S}\right)_V$. Applying the same to $H, F, G$:

$$\boxed{\left(\frac{\partial T}{\partial V}\right)_S = -\left(\frac{\partial P}{\partial S}\right)_V,\quad \left(\frac{\partial T}{\partial P}\right)_S = \left(\frac{\partial V}{\partial S}\right)_P,\quad \left(\frac{\partial S}{\partial V}\right)_T = \left(\frac{\partial P}{\partial T}\right)_V,\quad \left(\frac{\partial S}{\partial P}\right)_T = -\left(\frac{\partial V}{\partial T}\right)_P}$$

*(Memory aid: the last two are the ones you actually use — they trade an unmeasurable entropy derivative for a measurable equation-of-state derivative.)*

**(c) TdS equations.** Take $S = S(T,V)$:
$$dS = \left(\frac{\partial S}{\partial T}\right)_V dT + \left(\frac{\partial S}{\partial V}\right)_T dV.$$
Since $C_V = T(\partial S/\partial T)_V$ and using the third Maxwell relation,
$$\boxed{T\,dS = C_V\,dT + T\left(\frac{\partial P}{\partial T}\right)_V dV.} \qquad \text{(first TdS equation)}$$
Similarly with $S = S(T,P)$, $C_P = T(\partial S/\partial T)_P$, and the fourth Maxwell relation,
$$\boxed{T\,dS = C_P\,dT - T\left(\frac{\partial V}{\partial T}\right)_P dP.} \qquad \text{(second TdS equation)}$$

**(d) The general $C_P - C_V$.** Equate the two TdS expressions:
$$C_V dT + T\left(\frac{\partial P}{\partial T}\right)_V dV = C_P dT - T\left(\frac{\partial V}{\partial T}\right)_P dP.$$
Hold $P$ constant ($dP=0$) and divide by $dT$:
$$C_P - C_V = T\left(\frac{\partial P}{\partial T}\right)_V\left(\frac{\partial V}{\partial T}\right)_P.$$
Now use the cyclic (triple-product) rule $\left(\frac{\partial P}{\partial T}\right)_V\left(\frac{\partial T}{\partial V}\right)_P\left(\frac{\partial V}{\partial P}\right)_T = -1$, i.e.
$$\left(\frac{\partial P}{\partial T}\right)_V = -\frac{(\partial V/\partial T)_P}{(\partial V/\partial P)_T}.$$
Therefore
$$C_P - C_V = -T\,\frac{\left[(\partial V/\partial T)_P\right]^2}{(\partial V/\partial P)_T} = \boxed{\frac{TV\beta^2}{\kappa_T}}$$
using $\beta = \frac1V(\partial V/\partial T)_P$ and $\kappa_T = -\frac1V(\partial V/\partial P)_T$.

**Ideal-gas check.** $PV = nRT \Rightarrow \beta = 1/T$, $\kappa_T = 1/P$. Then
$$C_P - C_V = \frac{TV(1/T^2)}{1/P} = \frac{PV}{T} = nR. \;\checkmark$$

**Sign comment (a favourite one-mark rider).** Thermodynamic stability requires $\kappa_T > 0$, and $\beta^2 \ge 0$, so $C_P \ge C_V$ **for every substance**, with equality only where $\beta = 0$ — e.g. water at $4^\circ$C, where its density is maximum. Note also that $C_P - C_V \to 0$ as $T\to 0$, consistent with the third law.

---

### P2 — Clausius–Clapeyron and phase coexistence

**(a) Derivation.** Two phases 1 and 2 coexist in equilibrium at $(P,T)$. The condition for equilibrium at fixed $P,T$ with matter exchange is equality of the chemical potentials, i.e. of the *specific* Gibbs functions:
$$g_1(P,T) = g_2(P,T).$$
Move along the coexistence curve by $(dP, dT)$; equilibrium must be maintained, so $dg_1 = dg_2$. With $dg = -s\,dT + v\,dP$:
$$-s_1dT + v_1dP = -s_2dT + v_2dP \;\Rightarrow\; \frac{dP}{dT} = \frac{s_2-s_1}{v_2-v_1}.$$
The transition is at constant $T$, so the latent heat is $L = T(s_2-s_1)$, giving
$$\boxed{\frac{dP}{dT} = \frac{L}{T(v_2-v_1)} = \frac{L}{T\,\Delta v}.}$$

**(b) Liquid → vapour.** Approximations UPSC wants stated explicitly: (i) $v_g \gg v_\ell$, so $\Delta v \approx v_g$; (ii) the vapour is ideal, $v_g = RT/P$ per mole. Then
$$\frac{dP}{dT} = \frac{L_m P}{RT^2} \;\Rightarrow\; \frac{d\ln P}{dT} = \frac{L_m}{RT^2} \;\Rightarrow\; \boxed{\ln P = -\frac{L_m}{RT} + \text{const}}$$
(taking $L_m$ constant over the range). This is why a $\ln P$ vs $1/T$ plot is a straight line of slope $-L_m/R$ — the standard way to measure a latent heat.

**(c) Numerical.** At $T = 373.15$ K, $P = 1.013\times10^5$ Pa:
$$v_g = \frac{RT}{P} = \frac{8.314\times373.15}{1.013\times10^5} = \frac{3102.4}{1.013\times10^5} = 3.063\times10^{-2}\ \text{m}^3\text{mol}^{-1}.$$
$$\frac{dP}{dT} = \frac{L_m}{T\,v_g} = \frac{40650}{373.15 \times 3.063\times10^{-2}} = \frac{40650}{11.43} \approx \boxed{3.56\times10^{3}\ \text{Pa K}^{-1}} \;(\approx 35.6\ \text{mbar K}^{-1}).$$
For $\Delta P = -11$ kPa:
$$\Delta T \approx \frac{\Delta P}{dP/dT} = \frac{-1.1\times10^4}{3.56\times10^3} \approx -3.1\ \text{K},$$
so water boils at about $\boxed{96.9^\circ\text{C}}$ — the familiar $\sim3^\circ$C drop per 1000 m of altitude.

**(d) Second-order transitions.** For a second-order (continuous) transition there is **no latent heat and no volume change**: $\Delta s = 0$ and $\Delta v = 0$, so Clausius–Clapeyron gives the indeterminate $0/0$. Applying L'Hôpital's rule to the continuity of $s$ and $v$ across the line gives the **Ehrenfest equations**:
$$\frac{dP}{dT} = \frac{\Delta C_P}{TV\,\Delta\beta}, \qquad \frac{dP}{dT} = \frac{\Delta\beta}{\Delta\kappa_T}.$$
Examples: the normal–superconducting transition in zero field, and the $\lambda$-transition in $^4$He (which is in fact not exactly Ehrenfest-second-order, a good remark to add).

---

### P3 — Joule–Thomson effect

**(a) Isenthalpic, and the coefficient.** Gas is forced steadily through a porous plug from $(P_1,V_1)$ to $(P_2,V_2)$, thermally insulated. Work done *on* the gas upstream is $P_1V_1$; work done *by* the gas downstream is $P_2V_2$. With $Q = 0$,
$$U_2 - U_1 = P_1V_1 - P_2V_2 \;\Rightarrow\; U_1 + P_1V_1 = U_2 + P_2V_2 \;\Rightarrow\; \boxed{H_1 = H_2.}$$

Now, with $H = H(T,P)$ and $dH = 0$,
$$\left(\frac{\partial T}{\partial P}\right)_H = -\frac{(\partial H/\partial P)_T}{(\partial H/\partial T)_P} = -\frac{1}{C_P}\left(\frac{\partial H}{\partial P}\right)_T.$$
From $dH = TdS + VdP$ at constant $T$: $\left(\frac{\partial H}{\partial P}\right)_T = T\left(\frac{\partial S}{\partial P}\right)_T + V$, and the fourth Maxwell relation gives $(\partial S/\partial P)_T = -(\partial V/\partial T)_P$. Hence
$$\boxed{\mu_{JT} = \frac{1}{C_P}\left[T\left(\frac{\partial V}{\partial T}\right)_P - V\right] = \frac{V}{C_P}\left(T\beta - 1\right).}$$

**(b) Ideal gas.** $V = RT/P \Rightarrow T(\partial V/\partial T)_P = RT/P = V$, so $\mu_{JT} = 0$: an ideal gas shows **no** temperature change on throttling. The effect is entirely due to intermolecular forces.

**(c) van der Waals to first order.** $\left(P + \dfrac{a}{v^2}\right)(v-b) = RT$. Writing $v = RT/P + \delta$ and keeping terms linear in $a,b$:
$$v \approx \frac{RT}{P} + b - \frac{a}{RT}.$$
Differentiate at constant $P$:
$$\left(\frac{\partial v}{\partial T}\right)_P = \frac{R}{P} + \frac{a}{RT^2}.$$
Therefore
$$T\left(\frac{\partial v}{\partial T}\right)_P - v = \left(\frac{RT}{P} + \frac{a}{RT}\right) - \left(\frac{RT}{P} + b - \frac{a}{RT}\right) = \frac{2a}{RT} - b,$$
$$\boxed{\mu_{JT} = \frac{1}{C_P}\left(\frac{2a}{RT} - b\right).}$$

**Physical reading:** the $2a/RT$ term is the *attractive* contribution — expanding against mutual attraction costs internal energy, so the gas **cools**. The $-b$ term is the *repulsive/finite-size* contribution, which **warms** the gas. Setting $\mu_{JT} = 0$:
$$\boxed{T_i = \frac{2a}{Rb}}$$
— the (maximum) inversion temperature. For $T < T_i$ the gas cools on throttling; for $T > T_i$ it warms.

**(d) Numerical.**
$$\text{CO}_2: \quad T_i = \frac{2(0.364)}{8.314\times 4.27\times10^{-5}} = \frac{0.728}{3.549\times10^{-4}} \approx \boxed{2.05\times10^3\ \text{K}}$$
$$\text{H}_2: \quad T_i = \frac{2(0.0248)}{8.314\times 2.66\times10^{-5}} = \frac{0.0496}{2.212\times10^{-4}} \approx \boxed{224\ \text{K}}$$

**Consequence:** CO$_2$ throttled from room temperature cools strongly (hence dry-ice formation from a CO$_2$ cylinder). Hydrogen at $300$ K is *above* its inversion temperature, so throttling **heats** it — H$_2$ must be **pre-cooled below $\sim$200 K** (classically with liquid nitrogen) before a Linde–Hampson cascade can liquefy it. The same is true, still more severely, for helium ($T_i \approx 40$ K). *(Note: the exact vdW inversion curve is a closed loop in the $P$–$T$ plane with an upper and a lower branch; $T_i = 2a/Rb$ is the low-pressure limit of the upper branch, i.e. the maximum inversion temperature. Say this — it is worth a mark.)*

---

### P4 — Ideal gas partition function, Sackur–Tetrode, Gibbs paradox

**(a) Partition function.** For a free particle in a box of volume $V$, sum over translational states $\to$ integral over phase space with the measure $d^3q\,d^3p/h^3$:
$$z = \frac{1}{h^3}\int d^3q \int d^3p\; e^{-\beta p^2/2m} = \frac{V}{h^3}\left(\int_{-\infty}^{\infty}e^{-\beta p_x^2/2m}dp_x\right)^3 = \frac{V}{h^3}\left(\frac{2\pi m}{\beta}\right)^{3/2}.$$
Define the **thermal de Broglie wavelength** $\lambda = h/\sqrt{2\pi mk_BT}$. Then
$$\boxed{z = \frac{V}{\lambda^3}, \qquad Z_N = \frac{z^N}{N!}}$$
the $1/N!$ accounting for the indistinguishability of the $N$ atoms.

**(b) Thermodynamics.** Using Stirling ($\ln N! \approx N\ln N - N$):
$$\ln Z_N = N\ln z - N\ln N + N = N\left[\ln\frac{V}{N\lambda^3} + 1\right].$$
$$F = -k_BT\ln Z_N = -Nk_BT\left[\ln\frac{V}{N\lambda^3} + 1\right].$$

*Equation of state:*
$$P = -\left(\frac{\partial F}{\partial V}\right)_T = Nk_BT\frac{\partial}{\partial V}\ln V = \boxed{\frac{Nk_BT}{V}} \;\checkmark$$

*Internal energy:* $\lambda \propto T^{-1/2}$, so $\ln Z_N$ contains $+\tfrac32 N\ln T$, and
$$U = -\frac{\partial \ln Z_N}{\partial\beta} = k_BT^2\frac{\partial\ln Z_N}{\partial T} = \boxed{\tfrac32 Nk_BT} \;\checkmark \quad (C_V = \tfrac32Nk_B)$$

*Entropy:*
$$S = -\left(\frac{\partial F}{\partial T}\right)_V = Nk_B\left[\ln\frac{V}{N\lambda^3} + 1\right] + Nk_BT\cdot\frac{3}{2T} = \boxed{Nk_B\left[\ln\left(\frac{V}{N}\left(\frac{2\pi mk_BT}{h^2}\right)^{3/2}\right) + \frac52\right]}$$
which is the **Sackur–Tetrode equation**.

**(c) Gibbs paradox.** If the $1/N!$ is omitted, $F = -Nk_BT\ln(V/\lambda^3)$ and
$$S_{\text{wrong}} = Nk_B\left[\ln\frac{V}{\lambda^3} + \frac32\right].$$
This is **not extensive**: doubling $N$ and $V$ together does not double $S$, because of the $N\ln V$ term. Concretely, remove a partition between two equal volumes $V$ of the *same* gas at the same $T$ and density. Physically nothing happens and $\Delta S$ must be zero, but $S_{\text{wrong}}$ predicts
$$\Delta S = 2Nk_B\ln 2 \ne 0$$
— the **Gibbs paradox**: an entropy of mixing for identical gases.

**Resolution.** Classically the atoms were treated as labelled, so the $N!$ permutations of identical atoms among the same single-particle states were counted as *distinct* microstates. They are not. Dividing by $N!$ — "correct Boltzmann counting", which quantum mechanics supplies automatically through the (anti)symmetry of the many-body wavefunction — restores the $\ln(V/N)$ form, makes $S$ extensive, and gives $\Delta S = 0$ for identical gases while correctly retaining $\Delta S = 2Nk_B\ln 2$ for the mixing of two *different* gases.

---

### P5 — Planck's law, Stefan–Boltzmann, Wien

**(a) Derivation.** Two ingredients.

*Mode counting.* In a cubical cavity of side $L$, the standing-wave modes have $\mathbf{k} = (\pi/L)(n_x,n_y,n_z)$ with positive integers $n_i$. The number of modes with wavenumber up to $k$ is the volume of the positive octant of a sphere in $n$-space, times 2 for the two transverse polarizations:
$$N(k) = 2\times\frac18\times\frac{4}{3}\pi\left(\frac{kL}{\pi}\right)^3 = \frac{Vk^3}{3\pi^2}.$$
With $k = 2\pi\nu/c$: $N(\nu) = 8\pi V\nu^3/3c^3$, so the mode density per unit volume per unit frequency is
$$g(\nu)\,d\nu = \frac{8\pi\nu^2}{c^3}\,d\nu.$$

*Occupation.* Photons are massless bosons whose number is **not conserved** (they are freely created and destroyed by the cavity walls), so the constraint on $N$ is absent and the chemical potential $\mu = 0$. The Bose–Einstein distribution gives the mean occupation of a mode of frequency $\nu$:
$$\langle n(\nu)\rangle = \frac{1}{e^{h\nu/k_BT}-1}.$$

Multiplying mode density × mean occupation × energy $h\nu$ per photon:
$$\boxed{u(\nu)\,d\nu = \frac{8\pi h\nu^3}{c^3}\,\frac{d\nu}{e^{h\nu/k_BT}-1}}$$

**(b) Limits.**
*Rayleigh–Jeans* ($h\nu \ll k_BT$): $e^{h\nu/k_BT}-1 \approx h\nu/k_BT$, so
$$u(\nu)d\nu \to \frac{8\pi\nu^2}{c^3}k_BT\,d\nu,$$
i.e. $k_BT$ per mode (classical equipartition). Since $\int_0^\infty \nu^2 d\nu$ diverges, the total energy would be infinite — the **ultraviolet catastrophe**. Quantization cures it because modes with $h\nu \gg k_BT$ cannot be excited even to their first quantum.

*Wien* ($h\nu \gg k_BT$): the $-1$ is negligible and
$$u(\nu)d\nu \to \frac{8\pi h\nu^3}{c^3}e^{-h\nu/k_BT}d\nu,$$
Wien's empirical exponential law.

**(c) Stefan–Boltzmann.** Substituting $x = h\nu/k_BT$:
$$u = \int_0^\infty u(\nu)d\nu = \frac{8\pi h}{c^3}\left(\frac{k_BT}{h}\right)^4\int_0^\infty\frac{x^3dx}{e^x-1}.$$
The standard integral is $\int_0^\infty \frac{x^3dx}{e^x-1} = \Gamma(4)\zeta(4) = 6\times\frac{\pi^4}{90} = \frac{\pi^4}{15}$. Hence the energy density
$$u = \frac{8\pi^5k_B^4}{15c^3h^3}T^4 \equiv aT^4.$$
The power radiated per unit area from a black surface is $E = \frac{c}{4}u$ (the geometric factor from integrating the isotropic flux over the outward hemisphere), so
$$\boxed{E = \sigma T^4, \qquad \sigma = \frac{2\pi^5k_B^4}{15c^2h^3} = 5.67\times10^{-8}\ \text{W m}^{-2}\text{K}^{-4}.}$$

**(d) Wien's displacement law.** Convert to wavelength using $u(\lambda)d\lambda = -u(\nu)d\nu$ with $\nu = c/\lambda$:
$$u(\lambda) = \frac{8\pi hc}{\lambda^5}\frac{1}{e^{hc/\lambda k_BT}-1}.$$
Set $du/d\lambda = 0$ with $x = hc/\lambda k_BT$. This gives the transcendental equation
$$5\left(1 - e^{-x}\right) = x \;\Rightarrow\; x = 4.965.$$
Therefore
$$\boxed{\lambda_{\max}T = \frac{hc}{4.965\,k_B} = \frac{6.626\times10^{-34}\times3\times10^{8}}{4.965\times1.381\times10^{-23}} = 2.898\times10^{-3}\ \text{m K}.}$$

*Sanity check worth quoting:* the Sun's $\lambda_{\max}\approx 500$ nm gives $T \approx 5800$ K. Note also that maximizing $u(\nu)$ instead gives $x = 2.821$ and a *different* peak — the peak of the spectrum depends on whether you plot per unit $\lambda$ or per unit $\nu$. UPSC has asked for this remark.

---

### P6 — Bose–Einstein condensation

**(a) Setting up.** For an ideal Bose gas the mean occupation is $\bar n_\varepsilon = \left[e^{(\varepsilon-\mu)/k_BT}-1\right]^{-1}$, which requires $\mu \le 0$ (taking the ground state at $\varepsilon = 0$). The density of states for non-relativistic spinless particles is
$$g(\varepsilon) = \frac{V}{4\pi^2}\left(\frac{2m}{\hbar^2}\right)^{3/2}\sqrt{\varepsilon}.$$
Because $g(0) = 0$, replacing the sum over states by an integral **loses the ground state**. The correct decomposition is therefore
$$N = \underbrace{\frac{1}{e^{-\mu/k_BT}-1}}_{N_0\ \text{(ground state)}} + \int_0^\infty \frac{g(\varepsilon)\,d\varepsilon}{e^{(\varepsilon-\mu)/k_BT}-1}.$$
*Stating why the ground state must be separated out is the key conceptual mark in this question.*

**(b) The critical temperature.** The excited-state integral is bounded above; its maximum is at $\mu = 0$:
$$N_{ex}^{\max} = \frac{V}{4\pi^2}\left(\frac{2mk_BT}{\hbar^2}\right)^{3/2}\int_0^\infty\frac{\sqrt{x}\,dx}{e^x-1}, \qquad \int_0^\infty\frac{\sqrt{x}\,dx}{e^x-1} = \Gamma(\tfrac32)\zeta(\tfrac32) = \frac{\sqrt\pi}{2}(2.612).$$
Simplifying, this is exactly
$$N_{ex}^{\max} = \frac{V}{\lambda^3}\zeta(3/2), \qquad \lambda = \frac{h}{\sqrt{2\pi mk_BT}}.$$
$T_c$ is defined by $N_{ex}^{\max}(T_c) = N$, i.e. by the elegant condition
$$\boxed{n\lambda^3 = \zeta(3/2) = 2.612}$$
— *condensation sets in when the thermal de Broglie wavelength becomes comparable to the interparticle spacing*, so the wavepackets overlap. Solving for $T_c$:
$$\frac{h^2}{2\pi mk_BT_c} = \left(\frac{2.612}{n}\right)^{2/3} \;\Rightarrow\; \boxed{T_c = \frac{h^2}{2\pi mk_B}\left(\frac{n}{\zeta(3/2)}\right)^{2/3} = \frac{2\pi\hbar^2}{mk_B}\left(\frac{n}{2.612}\right)^{2/3}}$$

**Condensate fraction.** For $T < T_c$, $\mu$ is pinned at (essentially) zero and the excited states can hold only $N_{ex}(T) = V\zeta(3/2)/\lambda^3 \propto T^{3/2}$. Since $N_{ex}(T_c) = N$,
$$\frac{N_{ex}}{N} = \left(\frac{T}{T_c}\right)^{3/2} \;\Rightarrow\; \boxed{\frac{N_0}{N} = 1 - \left(\frac{T}{T_c}\right)^{3/2}} \quad (T<T_c).$$
Sketch this: zero above $T_c$, rising to 1 at $T=0$, with infinite slope at $T_c$. The surplus particles are forced into the single ground state — a **condensation in momentum space**, not in real space.

**(c) Numerical for $^4$He.**
$$\frac{h^2}{2\pi mk_B} = \frac{(6.626\times10^{-34})^2}{2\pi(6.65\times10^{-27})(1.381\times10^{-23})} = \frac{4.390\times10^{-67}}{5.771\times10^{-49}} = 7.607\times10^{-19}\ \text{K m}^{2}.$$
$$\left(\frac{n}{2.612}\right)^{2/3} = \left(\frac{2.2\times10^{28}}{2.612}\right)^{2/3} = \left(8.423\times10^{27}\right)^{2/3} = (2.033\times10^{9})^2 = 4.133\times10^{18}\ \text{m}^{-2}.$$
$$T_c = 7.607\times10^{-19}\times4.133\times10^{18} = \boxed{3.14\ \text{K}}$$

**Comment.** The observed $\lambda$-point of liquid $^4$He is $2.17$ K — the same order, which is a striking success for a model that ignores interactions entirely, and is the standard evidence that superfluidity in $^4$He is fundamentally a BEC phenomenon. The $\sim30\%$ discrepancy is because liquid helium is a **strongly interacting** liquid, not an ideal gas: interactions deplete the condensate (only $\sim10\%$ of atoms are in the zero-momentum state at $T=0$) and change the excitation spectrum from free-particle to the phonon–roton form. The unambiguous, weakly-interacting realisation of the ideal-gas formula came only with dilute alkali vapours (Rb, Na, 1995), at $T_c \sim 100$ nK.

---

### P7 — Degenerate free-electron gas

**(a) Density of states and $E_F$.** Free electrons in volume $V$ with periodic boundary conditions have one state per volume $(2\pi)^3/V$ of $k$-space; including 2 spin states, the number with wavevector up to $k$ is
$$N(k) = 2\cdot\frac{V}{(2\pi)^3}\cdot\frac{4}{3}\pi k^3 = \frac{Vk^3}{3\pi^2}.$$
With $E = \hbar^2k^2/2m$,
$$g(E) = \frac{dN}{dE} = \frac{V}{2\pi^2}\left(\frac{2m}{\hbar^2}\right)^{3/2}\sqrt{E}.$$
At $T = 0$ the Fermi function is a step: all states up to $E_F$ are filled, so
$$N = \int_0^{E_F}g(E)dE = \frac{V}{3\pi^2}\left(\frac{2mE_F}{\hbar^2}\right)^{3/2} \;\Rightarrow\; \boxed{E_F = \frac{\hbar^2}{2m}\left(3\pi^2 n\right)^{2/3}}, \quad n = N/V.$$

**(b) Mean energy and pressure.**
$$U = \int_0^{E_F}E\,g(E)dE = \frac{\frac25 E_F^{5/2}}{\frac23 E_F^{3/2}}N = \tfrac35 NE_F \;\Rightarrow\; \boxed{\bar E = \tfrac35 E_F.}$$
For a non-relativistic gas the general relation $PV = \tfrac23 U$ holds (it follows from $E \propto V^{-2/3}$ at fixed quantum numbers), so
$$P = \frac{2U}{3V} = \boxed{\tfrac25 nE_F.}$$
This **degeneracy pressure** is purely a consequence of the exclusion principle — it survives at $T=0$ and is what supports white dwarfs.

**(c) Electronic specific heat.** Sommerfeld expansion gives
$$U(T) = \tfrac35NE_F + \frac{\pi^2}{4}Nk_B\frac{T^2}{T_F} + \dots \;\Rightarrow\; \boxed{C_{el} = \frac{\pi^2}{2}Nk_B\frac{T}{T_F} = \gamma T.}$$

**Physical explanation (the marks are here, not in the algebra).** Classically every electron should contribute $\tfrac32k_B$, giving $C_{el} = \tfrac32Nk_B$ — the long-standing paradox that metals show no such contribution. The resolution: the Pauli principle means an electron deep in the Fermi sea *cannot* absorb $\sim k_BT$ of energy because the states it would move into are already occupied. Only electrons within $\sim k_BT$ of the Fermi surface can be thermally excited, a fraction $\sim T/T_F$ of the total. Each of those does gain $\sim k_BT$, so
$$U_{\text{thermal}} \sim N\frac{T}{T_F}k_BT \;\Rightarrow\; C \sim Nk_B\frac{T}{T_F},$$
reproducing the exact result up to the factor $\pi^2/2$. The linearity in $T$ (rather than a constant) is the signature. At low $T$ the total is $C = \gamma T + AT^3$ (electronic + Debye lattice); plotting $C/T$ vs $T^2$ gives a straight line whose intercept is $\gamma$ — a standard experimental question.

**(d) Numerical for copper.**
$$3\pi^2 n = 29.608\times8.5\times10^{28} = 2.517\times10^{30}\ \text{m}^{-3}; \quad (3\pi^2n)^{2/3} = (1.360\times10^{10})^2 = 1.850\times10^{20}\ \text{m}^{-2}.$$
$$\frac{\hbar^2}{2m} = \frac{(1.055\times10^{-34})^2}{2\times9.109\times10^{-31}} = \frac{1.113\times10^{-68}}{1.822\times10^{-30}} = 6.108\times10^{-39}\ \text{J m}^2.$$
$$E_F = 6.108\times10^{-39}\times1.850\times10^{20} = 1.130\times10^{-18}\ \text{J} = \boxed{7.06\ \text{eV}}$$
$$T_F = \frac{E_F}{k_B} = \frac{1.130\times10^{-18}}{1.381\times10^{-23}} = \boxed{8.18\times10^{4}\ \text{K}}$$
Per mole at $T = 300$ K:
$$C_{el} = \frac{\pi^2}{2}R\frac{T}{T_F} = 4.935\times8.314\times\frac{300}{8.18\times10^4} = 4.935\times8.314\times3.667\times10^{-3} = 0.150\ \text{J mol}^{-1}\text{K}^{-1}.$$
Dulong–Petit lattice value $3R = 24.9$ J mol$^{-1}$K$^{-1}$, so
$$\frac{C_{el}}{C_{lattice}} \approx \frac{0.150}{24.9} \approx \boxed{0.6\%}$$
i.e. the electrons contribute essentially nothing to the room-temperature specific heat of a metal — exactly as observed, and the classic vindication of Fermi–Dirac statistics over the Drude model. (Note $T \ll T_F$ by three orders of magnitude: the electron gas in a metal is *highly degenerate* even at room temperature.)

---

### P8 — Paramagnetism, Schottky anomaly, and fluctuations

**(a) Two-level paramagnet and the Curie law.** Each dipole has two states, $E_\pm = \mp\mu B$ (moment parallel / antiparallel to $\mathbf{B}$). Single-dipole partition function, with $x \equiv \mu B/k_BT$:
$$z = e^{\beta\mu B} + e^{-\beta\mu B} = 2\cosh x, \qquad Z_N = z^N$$
(the dipoles are on fixed lattice sites and hence distinguishable — **no** $1/N!$ here; UPSC likes this distinction).

$$F = -Nk_BT\ln(2\cosh x), \qquad \langle E\rangle = -\frac{\partial\ln Z_N}{\partial\beta} = -N\mu B\tanh x.$$
The magnetisation is
$$\boxed{M = -\left(\frac{\partial F}{\partial B}\right)_T = N\mu\tanh\left(\frac{\mu B}{k_BT}\right)}$$

*Limits.* For $\mu B \gg k_BT$, $\tanh \to 1$: **saturation**, $M \to N\mu$. For $\mu B \ll k_BT$, $\tanh x \approx x$:
$$M \approx \frac{N\mu^2B}{k_BT} \;\Rightarrow\; \chi = \frac{\mu_0 M}{B} = \boxed{\frac{\mu_0N\mu^2}{k_BT} \equiv \frac{C}{T}} \qquad \textbf{(Curie law)}$$
*(For general spin $J$ the $\tanh$ is replaced by the Brillouin function $B_J(y)$, and $\chi = \mu_0Ng^2\mu_B^2J(J+1)/3k_BT$ — worth quoting as the generalisation.)*

**(b) Schottky anomaly.**
$$C = \frac{d\langle E\rangle}{dT} = \frac{d}{dT}\left[-N\mu B\tanh\frac{\mu B}{k_BT}\right] = \boxed{Nk_B\,x^2\,\mathrm{sech}^2x}, \qquad x = \frac{\mu B}{k_BT}.$$

*Behaviour.* As $T\to0$ ($x\to\infty$): $C \approx 4Nk_Bx^2e^{-2x} \to 0$ **exponentially** — there is an energy gap $2\mu B$, and $k_BT$ is too small to excite across it. As $T\to\infty$ ($x\to0$): $C \approx Nk_Bx^2 \to 0$ **as $1/T^2$** — both levels are then equally populated and adding heat can no longer change the populations. In between $C$ passes through a maximum (numerically at $x \approx 1.20$, i.e. $k_BT \approx 0.83\,\mu B$, with $C_{\max}\approx0.44Nk_B$). This broad bump is the **Schottky anomaly**, and its presence in a low-temperature $C(T)$ curve is the standard experimental signature of a discrete two-level splitting (nuclear spins, crystal-field levels).

Sketch: $C$ vs $T$ rising from zero, peaking near $k_BT\approx0.83\mu B$, then falling as $1/T^2$.

**(c) Energy fluctuations.** In the canonical ensemble, $\langle E\rangle = -\partial\ln Z/\partial\beta$. Differentiate once more:
$$\frac{\partial^2\ln Z}{\partial\beta^2} = \frac{\partial}{\partial\beta}\left(\frac{1}{Z}\frac{\partial Z}{\partial\beta}\right)\cdot(-1)\cdot(-1) = \frac{1}{Z}\frac{\partial^2Z}{\partial\beta^2} - \left(\frac{1}{Z}\frac{\partial Z}{\partial\beta}\right)^2 = \langle E^2\rangle - \langle E\rangle^2.$$
So $\langle(\Delta E)^2\rangle = -\dfrac{\partial\langle E\rangle}{\partial\beta}$. Converting $\beta = 1/k_BT$ (so $\partial/\partial\beta = -k_BT^2\,\partial/\partial T$):
$$\boxed{\langle(\Delta E)^2\rangle = k_BT^2\left(\frac{\partial\langle E\rangle}{\partial T}\right)_V = k_BT^2C_V}$$
— a **fluctuation–dissipation relation**: the spontaneous fluctuation of a quantity is fixed by the response function conjugate to it.

**Thermodynamic limit.** Both $\langle E\rangle$ and $C_V$ are extensive, $\propto N$. Hence
$$\frac{\sqrt{\langle(\Delta E)^2\rangle}}{\langle E\rangle} = \frac{\sqrt{k_BT^2C_V}}{\langle E\rangle} \sim \frac{\sqrt{N}}{N} = \frac{1}{\sqrt{N}} \xrightarrow[N\to\infty]{} 0.$$
For $N \sim 10^{23}$ the relative fluctuation is $\sim10^{-12}$: the canonical energy distribution is a delta function for all practical purposes, which is exactly why the canonical (fixed $T$) and microcanonical (fixed $E$) ensembles give identical thermodynamics. *(Rider worth adding: this argument fails at a **critical point**, where $C_V$ diverges — the fluctuations become macroscopic, which is the origin of critical opalescence.)*

---

## Recurring-pattern insights

**1. Every year, Paper I's thermo section is split roughly 50/50 between "classical manipulation" and "a quantum distribution."** The classical half is always one of a very short list — Maxwell relations / TdS equations / $C_P-C_V$ / Clausius–Clapeyron / Joule–Thomson / adiabatic demagnetisation. The statistical half is always one of Planck, BEC, or the Fermi gas. If you can do P1–P3 and P5–P7 cold, you have covered almost the entire realistic question space. Notice that **every** classical question reduces to the same two-step move: *write the relevant potential's differential → apply a Maxwell relation to eliminate the entropy derivative*. Drill that move until it is automatic and the whole classical half becomes one technique.

**2. The three "quantum gas" pillars rotate rather than repeat.** Blackbody/Planck, BEC, and the degenerate Fermi gas appear on a loose rotation — a year heavy on Planck+Stefan–Boltzmann tends to be light on BEC, and vice versa. All three, however, are built from the *same* two-line skeleton: **(density of states) × (occupation function), then integrate**. Write that skeleton at the top of your answer every time; examiners reward seeing the common structure, and it means you only have to remember three density-of-states expressions ($\propto\nu^2$ for photons, $\propto\sqrt\varepsilon$ for massive particles) and three occupation functions.

**3. Numericals here are single-formula plug-ins with a standard set of numbers.** UPSC almost never asks a multi-stage computation in this section — it asks you to evaluate $\sigma$, or $\lambda_{\max}T$, or $E_F$ for copper, or $T_c$ for helium, or $T_i$ for a named gas. **Memorise the standard results as landmarks**, so you can both produce them instantly and catch an arithmetic slip: $\sigma = 5.67\times10^{-8}$ · $\lambda_{\max}T = 2.898\times10^{-3}$ m K · $E_F(\text{Cu}) = 7.0$ eV, $T_F = 8.2\times10^4$ K · $T_c(^4\text{He, ideal}) = 3.1$ K vs observed $2.17$ K · $T_i(\text{CO}_2)\approx2050$ K, $T_i(\text{H}_2)\approx220$ K. If your answer for $E_F$ in a metal comes out at 70 eV or 0.7 eV, you have made an exponent error.

**4. Marks cluster on the physical comment, not the algebra.** Look back at the solutions above: *why* hydrogen must be pre-cooled, *why* $C_{el}$ is linear in $T$, *why* $1/N!$ is needed, *why* the ideal-gas $T_c$ overshoots for helium, *why* fluctuations vanish as $N^{-1/2}$. These riders are typically 3–5 marks of a 15-mark question and are the cheapest marks in the paper, because they require no calculation and cannot be lost to arithmetic. Never end a derivation at the boxed formula.

---

## One tip

**Build the thermodynamic (Born) square on your one-pager, and open every classical-thermo answer by drawing it in the margin.**

```
        V ——— F ——— T
        |           |
        U           G
        |           |
        S ——— H ——— P
```

Mnemonic: *"**V**alid **F**acts and **T**heoretical **U**nderstanding **G**enerate **S**olutions to **H**ard **P**roblems."* Each potential sits between its two natural variables ($F$ between $V$ and $T$, $G$ between $T$ and $P$, and so on). Reading off a differential: the potential's natural variables are its neighbours, and the conjugate coefficient sits at the diagonally opposite corner, with a minus sign whenever an arrow points *away* from the bottom-left. The four Maxwell relations are read off the four corners by going around the square — no memorisation of eight partial derivatives required.

This takes fifteen seconds in the exam hall and eliminates the single most common source of lost marks in this section: a sign error in a Maxwell relation that then propagates through an entire twenty-mark derivation. Practise reconstructing all four relations from the square, timed, until you can do it in under a minute — then you never have to *remember* one again.

---

*Set assigned: 2026-07-28 · Paper I Thermodynamics & Statistical Mechanics · 8 representative UPSC-style problems, ~100 min timed · Paper I rotation now complete; Paper II begins next fortnight with Quantum Mechanics.*
