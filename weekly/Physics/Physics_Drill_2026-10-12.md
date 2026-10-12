# Physics Optional Drill — week of 12 October 2026

**Fortnight F10 (6–19 Oct) · Hecht Optics Ch 1–3 · Geometrical optics (matrix/paraxial) + wave & EM basics (Fresnel, dispersion)**

> **Why these problems:** the 14 Jul and 21 Jul sets already covered interference, diffraction, polarization, coherence, lasers, fibres and holography. This drill deliberately goes to the *ground floor* of Hecht — Fermat, paraxial/matrix optics, thick lenses, Fresnel coefficients, and wave/group velocity — which have not been drilled yet. Attempt closed-book, ~60 min. Solutions are at the end.

---

## Problems

**P1 (thick lens, matrix method — 15 marks).** A biconvex glass lens has $n=1.5$, $R_1=+10$ cm, $R_2=-10$ cm and axial thickness $d=3$ cm, in air.
(a) Build the system ray-transfer matrix (refraction–translation–refraction) and verify $\det M=1$.
(b) Find the effective focal length and compare with the thin-lens value.
(c) Locate the principal planes and the back and front focal points relative to the vertices.

**P2 (Fresnel equations, Brewster, TIR — 15 marks).** Light of $\lambda_0=600$ nm is incident from air onto glass, $n=1.5$.
(a) Find the reflectance at normal incidence.
(b) Find Brewster's angle; prove $\theta_B+\theta_t=90^\circ$. Give $R_s$ and $R_p$ at $30^\circ$ and at $\theta_B$.
(c) For light going glass → air, find the critical angle. At $45^\circ$ incidence, find the penetration depth of the evanescent field (amplitude $1/e$) and the intensity $1/e$ depth.

**P3 (dispersion, phase vs group velocity — 15 marks).** (a) Derive Rayleigh's relation $v_g=v_p-\lambda\,\dfrac{dv_p}{d\lambda}$ and its refractive-index form $n_g=n-\lambda\,\dfrac{dn}{d\lambda}$.
(b) A glass has Cauchy dispersion $n=A+B/\lambda^2$ with $A=1.50$, $B=4000\ \text{nm}^2$. At $\lambda=600$ nm find $n$, $n_g$, $v_p/c$, $v_g/c$.
(c) State when $v_g>v_p$ and why $v_g>c$ does not violate relativity.

---

## Derivation to reproduce from memory

**Fermat's principle ⇒ refraction at a single spherical surface ⇒ lensmaker's formula.**
Starting from "the optical path $\int n\,ds$ is stationary", (i) obtain Snell's law, (ii) apply the paraxial limit to a spherical surface of radius $R$ to get $\dfrac{n_1}{s}+\dfrac{n_2}{s'}=\dfrac{n_2-n_1}{R}$, (iii) combine two surfaces (thin-lens limit) to get the lensmaker's formula and the Gaussian lens equation.

> **Log it** in your **Formula & Derivation Master Log** under *"Optics — Geometrical"*, along with the thick-lens result from P1.

---

## Past-year UPSC question (representative — NOT verbatim)

> A web search this run could not locate the exact wording or year of a matching Mains PYQ (only syllabus pages came back), so the item below is a **representative UPSC-style problem**, not a real paper question. Pull the real Physics Paper I PDFs from `upsc.gov.in` and search `"eyepiece"`, `"achromatic"`, `"cardinal points"`, `"spherical aberration"` to find the genuine ones. This theme (lens combinations, aberrations, eyepieces) recurs in Paper I optics.

**PYQ-style Q (20 marks).** Two thin lenses of the same material, focal lengths $f_1$ and $f_2$, are separated by $d$ in air.
(a) Derive the equivalent focal length $F$ and show that the combination is free of chromatic aberration (i.e. $F$ is independent of $\lambda$) when $d=\dfrac{f_1+f_2}{2}$.
(b) The Huygens eyepiece has $f_1=3f_2$. Show that it satisfies the achromatic condition for $d=2f_2$, and for $f_2=20$ mm find $F$, the back focal distance, and the position of the front focal point.
(c) Numerical: $f_1=30$ cm, $f_2=20$ cm, $d=10$ cm — find $F$ and the positions of the principal planes and focal points.

---

## High-yield formulas

| Result | Formula |
|---|---|
| Thick lens | $\dfrac1f=(n-1)\left[\dfrac1{R_1}-\dfrac1{R_2}+\dfrac{(n-1)d}{nR_1R_2}\right]$; $\ h_1=-\dfrac{f(n-1)d}{nR_2},\ h_2=-\dfrac{f(n-1)d}{nR_1}$ |
| Two thin lenses | $\dfrac1F=\dfrac1{f_1}+\dfrac1{f_2}-\dfrac d{f_1f_2}$; achromatic if $d=\dfrac{f_1+f_2}2$ (same glass); min. spherical aberration if $d=f_1-f_2$ |
| Group velocity | $v_g=v_p-\lambda\dfrac{dv_p}{d\lambda}$, $\ n_g=n-\lambda\dfrac{dn}{d\lambda}$ |

Also keep cold: Brewster $\tan\theta_B=n_2/n_1$; critical angle $\sin\theta_c=n_2/n_1$; evanescent decay constant $\beta=\dfrac{2\pi}{\lambda_0}\sqrt{n_1^2\sin^2\theta-n_2^2}$.

---

# Solutions

## P1 — Thick lens by matrices

Use the reduced-angle ray vector $(y,\,n\alpha)$. Refraction matrix $\begin{pmatrix}1&0\\-\mathcal P&1\end{pmatrix}$ with $\mathcal P=\dfrac{n_2-n_1}{R}$; translation matrix $\begin{pmatrix}1&d/n\\0&1\end{pmatrix}$.

**(a)** $\mathcal P_1=\dfrac{1.5-1}{10}=0.05\ \text{cm}^{-1}$, $\ \mathcal P_2=\dfrac{1-1.5}{-10}=0.05\ \text{cm}^{-1}$, $\ d/n=3/1.5=2$ cm.

$$M=\begin{pmatrix}1&0\\-0.05&1\end{pmatrix}\begin{pmatrix}1&2\\0&1\end{pmatrix}\begin{pmatrix}1&0\\-0.05&1\end{pmatrix}=\boxed{\begin{pmatrix}0.9&2\\-0.095&0.9\end{pmatrix}}$$

$\det M=AD-BC=(0.9)(0.9)-(2)(-0.095)=0.81+0.19=1.00$ ✓ (same medium both sides, so $\det=1$).

**(b)** The element $C=-1/f$:

$$\frac1f=0.095\ \text{cm}^{-1}\ \Rightarrow\ \boxed{f=10.53\ \text{cm}}$$

Check with the thick-lens formula: $\dfrac1f=0.5\left[0.1+0.1+\dfrac{0.5\times3}{1.5\times(-100)}\right]=0.5(0.19)=0.095$ ✓.
Thin-lens ($d\to0$) value: $1/f=0.5(0.2)=0.1\Rightarrow f=10$ cm. Thickness lowers the power slightly (by the $-0.005$ cm$^{-1}$ correction).

**(c)** Parallel ray in: the focus is where $y'=0$, giving back focal distance from the second vertex

$$\text{BFD}=-\frac AC=\frac{0.9}{0.095}=\boxed{9.47\ \text{cm}}$$

and symmetrically the front focal distance from $V_1$ is $D/C\to 9.47$ cm in front of the lens. Principal planes:

$$h_1=-\frac{f(n-1)d}{nR_2}=+1.05\ \text{cm},\qquad h_2=-\frac{f(n-1)d}{nR_1}=-1.05\ \text{cm}$$

i.e. $H_1$ lies 1.05 cm *inside* the lens from $V_1$, and $H_2$ lies 1.05 cm inside from $V_2$ (consistent: BFD $=f-1.05=9.47$ ✓). Same medium on both sides ⇒ nodal points coincide with principal points. **Always draw the lens with $H_1,H_2,F_1,F_2$ marked** — a diagram is worth 3 marks.

---

## P2 — Fresnel equations

**(a)** $R_0=\left(\dfrac{n-1}{n+1}\right)^2=\left(\dfrac{0.5}{2.5}\right)^2=\boxed{4\%}$.

**(b)** Using Snell's law to eliminate $n_1,n_2$, the Fresnel coefficient becomes $r_p=\dfrac{\tan(\theta_i-\theta_t)}{\tan(\theta_i+\theta_t)}$, which vanishes when the denominator diverges, i.e. $\theta_i+\theta_t=90^\circ$ ✓ (reflected and refracted rays perpendicular; the reflected ray carries no dipole radiation along the dipole axis). Then $\tan\theta_B=n_2/n_1$:

$$\boxed{\theta_B=\tan^{-1}1.5=56.31^\circ}$$

| Angle | $R_s$ | $R_p$ |
|---|---|---|
| $30^\circ$ | 5.78 % | 2.52 % |
| $56.31^\circ$ | 14.8 % | ≈ 0 |

At $\theta_B$ the reflected light is purely $s$-polarized (but only 14.8 % of the $s$-component is reflected, so a single-surface polarizer is weak; a pile-of-plates raises the output).

**(c)** Glass → air: $\sin\theta_c=1/1.5\Rightarrow\boxed{\theta_c=41.81^\circ}$. At $\theta=45^\circ>\theta_c$ we get total internal reflection; the transmitted field is evanescent, $E\propto e^{-\beta z}$ with

$$\beta=\frac{2\pi}{\lambda_0}\sqrt{n_1^2\sin^2\theta-n_2^2}=\frac{2\pi}{600\ \text{nm}}\sqrt{2.25(0.5)-1}=\frac{2\pi}{600}(0.3536)\ \text{nm}^{-1}$$

$$\delta=\frac1\beta=\boxed{270\ \text{nm}}\ (\text{amplitude}),\qquad \delta_I=\frac{\delta}{2}\approx135\ \text{nm}\ (\text{intensity}).$$

So the field penetrates ~$\lambda/2$. Mention: carries no net energy (Poynting vector normal to the surface averages to zero), but frustrated TIR (a second prism within $\sim\delta$) leaks energy — the basis of TIRF microscopy and evanescent-wave sensors.

---

## P3 — Phase and group velocity

**(a)** Superpose two waves $\omega\pm\Delta\omega/2$, $k\pm\Delta k/2$: the envelope moves at $v_g=d\omega/dk$. With $\omega=kv_p$:

$$v_g=v_p+k\frac{dv_p}{dk},\qquad k=\frac{2\pi}\lambda\Rightarrow\frac{dk}{k}=-\frac{d\lambda}\lambda\Rightarrow\boxed{v_g=v_p-\lambda\frac{dv_p}{d\lambda}}$$

With $v_p=c/n$: $\dfrac{dv_p}{d\lambda}=-\dfrac c{n^2}\dfrac{dn}{d\lambda}$, so $v_g=\dfrac cn\left(1+\dfrac\lambda n\dfrac{dn}{d\lambda}\right)\approx\dfrac c{n-\lambda\,dn/d\lambda}$, i.e. $\boxed{n_g=n-\lambda\dfrac{dn}{d\lambda}}$ (exactly $n_g=n+\omega\,dn/d\omega$).

**(b)** $n=1.50+\dfrac{4000}{600^2}=1.5111$. $\ \dfrac{dn}{d\lambda}=-\dfrac{2B}{\lambda^3}\Rightarrow-\lambda\dfrac{dn}{d\lambda}=\dfrac{2B}{\lambda^2}=0.0222$.

$$n_g=1.5333,\quad v_p/c=0.6618,\quad v_g/c=0.6522,\quad \frac{v_g}{v_p}=0.9855$$

**(c)** Normal dispersion ($dn/d\lambda<0$) ⇒ $v_g<v_p$. $v_g>v_p$ (and even $v_g>c$ or negative) occurs in **anomalous dispersion** (near absorption lines), where the group-velocity concept breaks down because the pulse is heavily absorbed/distorted. No violation of relativity: *signal* (front) velocity is what's bounded by $c$, and $v_p>c$ is likewise harmless since a pure monochromatic wave carries no information.

---

## Derivation — Fermat → spherical surface → lensmaker

**(i) Snell.** Path from $A$ (in $n_1$) to $B$ (in $n_2$) via interface point at coordinate $x$: $\text{OPL}=n_1\sqrt{a^2+x^2}+n_2\sqrt{b^2+(L-x)^2}$. Set $d(\text{OPL})/dx=0$: $n_1\sin\theta_1=n_2\sin\theta_2$ ✓.

**(ii) Spherical surface.** Object $O$ at distance $s$ from vertex $V$, image $I$ at $s'$, surface centre $C$ at radius $R$, ray hitting at height $h$. OPL $=n_1\ell_o+n_2\ell_i$ with $\ell_o^2=R^2+(s+R)^2-2R(s+R)\cos\varphi$, $\ell_i^2=R^2+(s'-R)^2+2R(s'-R)\cos\varphi$. Setting $d(\text{OPL})/d\varphi=0$ gives

$$\frac{n_1R(s+R)\sin\varphi}{\ell_o}-\frac{n_2R(s'-R)\sin\varphi}{\ell_i}=0\ \Rightarrow\ \frac{n_1(s+R)}{\ell_o}=\frac{n_2(s'-R)}{\ell_i}.$$

Paraxial limit: $\ell_o\to s$, $\ell_i\to s'$, so $\dfrac{n_1(s+R)}{s}=\dfrac{n_2(s'-R)}{s'}\Rightarrow$

$$\boxed{\frac{n_1}{s}+\frac{n_2}{s'}=\frac{n_2-n_1}{R}}$$

**(iii) Lensmaker.** First surface ($n_1\to n$) forms an image at $s_1'$ that acts as object for the second surface ($n\to n_1$). In the thin-lens limit $(d\to0)$ add the two equations: $\dfrac{n_1}{s}+\dfrac{n_1}{s'}=(n-n_1)\left(\dfrac1{R_1}-\dfrac1{R_2}\right)$. With $n_1=1$: $\dfrac1s+\dfrac1{s'}=\dfrac1f=(n-1)\left(\dfrac1{R_1}-\dfrac1{R_2}\right)$.

---

## PYQ-style Q — Achromatic two-lens system, Huygens eyepiece

**(a)** Equivalent focal length:

$$\frac1F=\frac1{f_1}+\frac1{f_2}-\frac d{f_1f_2}\qquad(\ast)$$

For a thin lens of one material, $\dfrac1{f_i}=(n-1)K_i\ (K_i$ geometry$)$, so $\delta\!\left(\dfrac1{f_i}\right)=\dfrac1{f_i}\,\delta$ with $\delta=\dfrac{dn}{n-1}$. Hence $\delta\!\left(\dfrac1{f_1f_2}\right)=\dfrac{2\delta}{f_1f_2}$. Varying $(\ast)$ with $\lambda$:

$$\delta\!\left(\frac1F\right)=\delta\left[\frac1{f_1}+\frac1{f_2}-\frac{2d}{f_1f_2}\right]=0\ \Rightarrow\ \boxed{d=\frac{f_1+f_2}2}$$

Note this removes the *variation of $F$* (equivalent to lateral/transverse chromatic aberration being corrected for the image size), **not** longitudinal colour — a distinction UPSC likes.

**(b)** $f_1=3f_2$: $\ d=\dfrac{3f_2+f_2}2=2f_2$ ✓. With $f_2=20$ mm, $f_1=60$ mm, $d=40$ mm:

$$F=\frac{f_1f_2}{f_1+f_2-d}=\frac{1200}{40}=\boxed{30\ \text{mm}},\qquad \text{BFD}=\frac{F(f_1-d)}{f_1}=\boxed{10\ \text{mm}}$$

Front focal distance from the field lens: $\dfrac{F(f_2-d)}{f_2}=-30$ mm, so the front focal point lies **30 mm *behind* the field lens (between the lenses)** — a virtual-object focal plane, which is exactly why a Huygens eyepiece can only be used with a *real-image-plane reticle in between* when viewing a virtual image, and *cannot* serve as a simple magnifier on a real object. Also $d=f_1-f_2=40$ mm: it simultaneously satisfies the minimum-spherical-aberration condition for two lenses of the same material.

**(c)** $f_1=30,\ f_2=20,\ d=10$ cm:

$$F=\frac{600}{30+20-10}=\boxed{15\ \text{cm}}$$

Principal planes: $h_1=\dfrac{Fd}{f_2}=7.5$ cm to the right of $L_1$; $h_2=-\dfrac{Fd}{f_1}=-5.0$ cm (5 cm to the left of $L_2$). Back focal point: BFD $=F(f_1-d)/f_1=10$ cm from $L_2$ (= $F+h_2$ ✓). Front focal point: $F(f_2-d)/f_2=7.5$ cm in front of $L_1$.
