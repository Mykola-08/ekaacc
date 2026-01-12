================================================================================
COMPREHENSIVE ANIMATION THEORY GUIDE FOR VS CODE COPILOT
From: https://animations.dev/learn/animation-theory/
================================================================================

MODULE 01: ANIMATION THEORY
================================================================================

LESSON 1: WHAT MAKES AN ANIMATION FEEL RIGHT?
================================================================================

Core Principle: Animations feel right when they mirror the physics we experience 
every day. They feel familiar and natural.

Three Key Ingredients for Great Animations:
1. NATURAL FEEL - Mirrors real-world physics
2. PURPOSE - Clear reason for the animation's existence
3. TASTE - Developed skill in recognizing good vs bad animations

Natural Feel:
- Linear easing feels robotic and unnatural (nothing moves at constant speed)
- Linear animations have no energy and feel lifeless
- Use easing types that create natural acceleration/deceleration
- Blur effects help smooth transitions by blending states together
- Example: Apple's Dynamic Island feels alive because of natural motion

Purpose:
- Ask yourself: "What's the purpose of this animation?"
- Animations should improve UX, not create friction
- Common mistake: Animating too much to "delight" users
- Users have specific goals - they don't expect to be delighted
- Animations that are obvious why they exist feel right
- Animations that surprise or annoy users feel wrong
- Consider frequency of use - frequent interactions need less animation

Taste:
- Taste is NOT just personal preference - it can be learned and trained
- Great animation follows a set of rules (see Easing Blueprint)
- Develop taste by surrounding yourself with great work
- Study and analyze animations you admire
- Build a collection of reference animations
- Practice creating animations yourself

================================================================================
LESSON 2: THE EASING BLUEPRINT
================================================================================

CRITICAL CONCEPT: Easing is the most important part of any animation.
- Easing describes the rate at which something changes over time
- It can make a bad animation look great or a great animation look bad
- Easing influences perceived performance and speed of your interface

Easing and Perceived Performance:
- A faster-spinning spinner makes apps seem to load faster (same load time)
- Easing affects how fast your UI feels
- ease-in makes UI feel slower; ease-out makes UI feel faster
- Perception of speed is often more important than actual performance

EASING TYPES AND WHEN TO USE THEM:

1. EASE-OUT (Most commonly used)
   - Starts fast, ends slow
   - Best for: User-initiated interactions (dropdowns, modals)
   - Best for: Enter and exit animations
   - Best for: Marketing page intro animations
   - Gives users feeling of responsiveness
   - Acceleration at beginning signals UI is listening
   
   Tip: Add subtle scale(0.97) on :active pseudo-class with 150ms transition
        for more responsive button feel

2. EASE-IN-OUT (For elements already on screen)
   - Starts slow, speeds up, then slows down (like car acceleration/deceleration)
   - Best for: Elements moving to new position while staying on screen
   - Best for: Morphing elements into new shape
   - Feels natural because mimics real acceleration/deceleration
   - Example: Dynamic Island (Apple uses spring animations, but ease-in-out equivalent)
   
3. EASE-IN (AVOID - Makes UI feel sluggish)
   - Starts slow, ends fast
   - Makes interfaces feel sluggish and less responsive
   - Opposite of what we want for UI
   - Our brain expects things to settle at end of movement
   - Should generally be avoided
   
4. LINEAR (AVOID - Feels robotic)
   - Constant speed throughout
   - Feels robotic and unnatural
   - Only use for: Constant animations (marquees)
   - Only use for: Visualizing passage of time (hold to delete)
   - Only use for: 3D rotations
   
5. EASE (For hover effects and elegant transitions)
   - Similar to ease-in-out but asymmetrical
   - Starts faster, ends slower than ease-in-out
   - Best for: Hover effects on color, background-color, opacity
   - More elegant for smaller, gentle animations
   - Default timing function for CSS transitions

CUSTOM EASING CURVES:

Use custom easing functions instead of built-in CSS easings for more natural motion.

Custom Ease-Out (from weakest to strongest acceleration):
- ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1)
- ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1)
- ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1)
- ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)
- ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1)

Custom Ease-In-Out:
- ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955)
- ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1)
- ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1)
- ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1)
- ease-in-out-expo: cubic-bezier(1, 0, 0, 1)
- ease-in-out-circ: cubic-bezier(0.785, 0.135, 0.15, 0.86)

Custom Ease-In (generally avoid):
- ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53)
- ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19)
- ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22)
- ease-in-quint: cubic-bezier(0.755, 0.05, 0.855, 0.06)
- ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035)
- ease-in-circ: cubic-bezier(0.6, 0.04, 0.98, 0.335)

Creating Custom Curves:
- Use cubic-bezier() function in CSS
- Experiment to find perfect curve for specific scenario
- Example: Vaul uses iOS Sheet easing: cubic-bezier(0.32, 0.72, 0, 1)

================================================================================
LESSON 3: SPRING ANIMATIONS
================================================================================

Why Spring Animations?
- CSS animations/transitions require fixed duration
- Spring animations are based on physics of object attached to spring
- Feel more natural by definition (no fixed duration)
- More fluid than easing-based animations
- Heavily used in iOS; default in SwiftUI
- Make components feel like "living organisms"

How Spring Animations Work:
Spring animations are configured by describing object behavior:
- Mass: Weight of the object
- Tension/Stiffness: How stiff the spring is
- Damping: How much resistance to motion
- Velocity: Initial speed of movement

Alternative Configuration (Apple Method):
- Duration: Perceptual duration (time until animation feels finished)
- Bounce: Amount of bouncing at end

Perceptual Duration:
- Time it takes for animation to feel like it's finished
- Even though subtle movement continues after
- Allows natural movement without sacrificing duration parameter
- Easier to understand than mass/tension/velocity

Key Advantage: INTERRUPTIBILITY
- Spring animations use velocity when re-targeted mid-animation
- Movement feels smooth and natural when interrupted
- Momentum is preserved
- CSS animations cannot do this (they jump to new position)
- Example: Sonner toast component - CSS animation caused jumps when adding multiple toasts quickly

Bounce in Spring Animations:
- Spring animations can have bouncy effect
- Only appropriate in few UI scenarios
- Suitable for: Drag gestures (feels like throwing)
- Not suitable for: Simple state transitions
- Default: No bounce for elegant, natural feel
- If using bounce, keep value small

When to Use Spring Animations:
- Pros: More natural feel, interruptible, no fixed duration
- Cons: Requires library (Framer Motion, React Spring) with larger file sizes
- Trade-off: Consider package size vs native feel
- Simple transitions (color, opacity): Easing is fine
- Complex motion (trash interaction, modals): Spring animations better

Spring Animations in Different Tools:
- iOS: Native support, default in SwiftUI
- Web: Requires library (Framer Motion, React Spring)
- Figma: Has spring animation implementation

================================================================================
LESSON 4: TIMING AND PURPOSE
================================================================================

Core Principle: When done right, animations make interfaces feel predictable, 
faster, and more enjoyable. When done wrong, they feel unpredictable, slow, 
and annoying.

PURPOSEFUL ANIMATIONS:

Before animating, ask: "What's the purpose of this animation?"

Types of Animation Purpose:

1. EXPLANATORY - Helps user understand feature
   - Example: Linear's Product Intelligence animation
   - Example: Vercel's v0 explanation animation
   - More interesting than static assets

2. RESPONSIVE FEEDBACK - Shows UI is listening
   - Example: Scale down effect on button press (scale 0.97)
   - Small but important for perceived responsiveness
   - Gives immediate feedback to user action

3. SPATIAL CONSISTENCY - Makes gestures intuitive
   - Example: Sonner toast enters from top, exits to top
   - Swipe-down-to-dismiss gesture feels natural
   - Consistent direction creates spatial understanding

4. DELIGHT - Creates pleasant surprise
   - Example: Morphing feedback component
   - Works only if user rarely interacts with it
   - Becomes annoying if used multiple times daily
   - Initial delight fades with frequent use

FREQUENCY OF USE - Critical Factor:

High Frequency (hundreds of times daily):
- NO animation or minimal animation
- Example: Raycast (no animation on open)
- Users have clear goal, don't need delight
- Animation creates friction and slows workflow
- Keyboard-initiated actions: NEVER animate
- Arrow key navigation: Don't animate highlight

Medium Frequency (multiple times daily):
- Short animations only (under 300ms)
- Hover effects: Consider removing
- Subtle interactions: OK
- Test by imagining daily use, not one-time use

Low Frequency (rarely used):
- Can use longer animations
- Delight is appropriate
- More freedom with duration

PERCEPTION OF SPEED:

Rule of Thumb: UI animations should generally stay under 300ms

Why Speed Matters:
- Improves perceived performance of app
- Keeps connection between user action and UI response
- Makes interface feel like it's truly listening
- Faster animations = more responsive feeling

Spinner Example:
- Faster-spinning spinner = app seems to load faster
- Same actual load time
- Improves perceived performance

Dropdown Example:
- 180ms animation feels more responsive than 400ms
- Same easing, different duration
- Shorter duration = snappier feel

Tooltip Pattern:
- Initial delay before appearing (prevents accidental activation)
- Once open: No delay or animation on hover for other tooltips
- Feels faster without defeating purpose of initial delay

CHOOSING THE RIGHT DURATION:

General Rule: Under 300ms for most UI animations

Factors Affecting Duration:

1. SIZE OF ELEMENT
   - Bigger elements = "heavier" = should animate slower
   - Example: Vercel time machine (1s duration for large element)
   - Smaller elements = faster animation

2. EASING CURVE
   - Different easings feel different at same duration
   - ease-in feels slower than ease-out at same duration
   - May need to adjust duration based on easing
   - Example: Vaul uses 500ms (over 300ms guideline) with steep custom easing
   - Steep easing at beginning = needs longer duration to avoid feeling too fast

3. ELEMENT BEHAVIOR
   - Elements entering/exiting: Can be faster
   - Elements morphing on-screen: Can be slower
   - Depends on visual weight and distance traveled

MARKETING VS PRODUCT ANIMATIONS:

Marketing Pages:
- More freedom with duration
- Can use longer animations
- Viewed less frequently than product
- Should create memorable experience
- Can prioritize delight over efficiency
- Can use more complex animations

Product Animations:
- Must be fast (under 300ms usually)
- Frequency of use is critical
- Prioritize responsiveness and efficiency
- Delight is secondary to functionality
- Must not slow users down

================================================================================
LESSON 5: TASTE
================================================================================

What is Taste?
- Ability to recognize what separates good animations from bad ones
- NOT just personal preference (if it was, everyone's taste would be perfect)
- A skill that can be trained and improved
- Becomes more valuable as AI handles technical work
- Code is no longer differentiator - taste is

Why Taste Matters:

In World of Abundance:
- Simply having working product no longer enough
- Anyone can build with AI
- Quality and details are differentiators
- Brand, design, interactions, experience matter
- Taste is what makes products stand out

Quote: "In a world of scarcity, we treasure tools. In a world of abundance, we treasure taste."

Companies realize great products require:
- Great intuition
- Great intuition requires great taste
- Taste is the differentiator

How to Improve Your Taste:

1. SURROUND YOURSELF WITH GREAT WORK
   - Designers: Look at great designs
   - Writers: Read great books
   - Developers: Use great apps, study great code
   - Heavy exposure to great things shapes output
   - Learn from best in field

2. FIND AND STUDY TASTEMAKERS
   - Find people respected in their field
   - Look at who they admire
   - Build curated list of tastemakers
   - Study their work deeply
   - Copy and re-implement work you admire
   - Learn patterns and principles

3. THINK DEEPLY ABOUT WHY YOU LIKE SOMETHING
   - Don't just label as good or bad
   - Rationalize why something feels great
   - Analyze patterns, don't rely on gut feeling
   - Study interactions: Why does this feel good?
   - Go beyond surface level
   - Be curious

   Technique: Record animations and scrub through frame-by-frame
   - Greatest animations have lots of details
   - Scrubbing reveals details you miss at normal speed
   - Record your own animations to see what to improve
   - Accelerates learning process

4. PRACTICE YOUR CRAFT
   - Create things yourself
   - Designer should design, writer should write
   - Can't learn by watching others
   - Exercises train your taste
   - Seek feedback from others
   - Good critique beats trial and error

   The Taste Gap (Ira Glass):
   - Your taste is good enough to know your work isn't good yet
   - That gap is normal and good
   - Means you're developing taste
   - Keep practicing until work matches taste

5. CARE ABOUT YOUR WORK
   - Best people at any craft care deeply
   - They go extra mile
   - Don't stop until truly satisfied
   - People can sense care vs carelessness
   - Example: Apple products made with care
   - Example: Linear made with care
   - You feel it when using these products

Quote: "I don't think my taste in aesthetics is that much different than a lot of other people's. The difference is that I just get to be really stubborn about making things as good as we all know they can be." - Steve Jobs

================================================================================
LESSON 6: ANIMATIONS AND AI
================================================================================

The Changing Landscape:
- Barriers to entry for software engineering have never been lower
- Everyone can create apps thanks to AI
- Having working product no longer enough
- Focus has shifted to TASTE

Why AI Struggles with Animations:
- LLMs trained on lots of data
- Not all animations in training data are great
- AI struggles with motion principles
- Great animations are not common sense
- This is good news for you - it's a differentiator

Using AI for Animations:

Create RULE.md File:
- Set of instructions for LLMs (Cursor, Claude, ChatGPT)
- Feed animation principles to AI
- AI remembers rules when helping with animations
- Tells LLM what custom easings to use
- Tells LLM when to use bounce
- Tells LLM animations should be fast
- Especially useful when beginning animation journey

Animation Best Practices for AI (RULE.md Content):

EASING:
- Use custom easing functions over built-in CSS easings
- ease-out: For elements entering/exiting and user interactions
- ease-in-out: For elements moving within screen
- ease-in: Should generally be avoided
- linear: Only for constant animations or time visualization

DURATION & TIMING:
- Hover transitions: 200ms with ease easing
- Spring animations: Preferred for natural feel
- Avoid bouncy springs unless drag gestures
- Most animations should be fast (under 1s)
- Keep UI feeling responsive and listening
- Animate from trigger point (dropdown from button)
- Set transform-origin accordingly

MOTION/FRAMER MOTION:
- Prefer spring animations for natural feel
- Use transform instead of x/y for hardware acceleration
- Hardware accelerated: transform: translateX(100px)
- Not hardware accelerated: animate={{ x: 100 }}

PERFORMANCE:
- Animate mostly: opacity, transform
- Avoid: top, left, width, height (use transform instead)
- Blur: Keep values ≤ 20px
- will-change: Use sparingly, only for transform, opacity, clipPath, filter
- Never animate drag gestures with CSS variables

RADIX UI INTEGRATION:
- Use asChild with motion component
- Hoist state for exit animations
- Use AnimatePresence with forceMount
- Example pattern provided in lesson

Using AI Responsibly:
- Use AI for repetitive tasks and autocompletion
- Write hard parts yourself
- Don't outsource thinking, intuition, and care
- Must be involved in entire process
- Think deeply about what you create
- Qualities of excellence come from deep involvement

Quote: "The qualities that make something truly excellent come from being deeply involved in the entire process." - Karri Saarinen, CEO Linear

================================================================================
LESSON 7: PRACTICAL ANIMATION TIPS
================================================================================

RECORD YOUR ANIMATIONS

When animation feels off but you can't figure out why:
- Record it
- Play back frame by frame
- Helps see animation in new light
- Reveals details missed at normal speed
- Greatest animations have lots of details

Benefits:
- Notice details you might have missed
- Understand what feels wrong
- Record your own animations to improve them
- Record others' animations for inspiration

FIX SHAKY ANIMATIONS

Problem: Element shifts by 1px at start/end of transform animation
- Browser optimizes by swapping between GPU and CPU rendering
- GPU and CPU render things differently
- Causes 1px shift in some cases

Solution: Use will-change property
- Tells browser animation coming soon
- Browser can optimize and let GPU handle it
- Prevents GPU/CPU swap

CSS:
.element {
  will-change: transform;
}

GIVE YOURSELF A BREAK

Don't code and ship animations in one sitting:
- Take breaks, step away from code
- After break, you'll notice things you missed
- Maybe won't like some decisions you made
- Greatest animations take time to review and improve

Example: Sonner transitions
- Done in few days
- Replayed literally every day until published
- Additional tweaks made from repeated review
- Those tweaks made difference in final result

SCALE YOUR BUTTONS

Add subtle scale effect on button press:
- Scale: 0.97
- Duration: 150ms
- Easing: ease-out
- Applies to :active pseudo-class
- Makes UI feel more responsive
- Small detail with big impact

CSS:
button:active {
  transform: scale(0.97);
  transition: transform 150ms ease-out;
}

DON'T ANIMATE FROM SCALE(0)

Problem: Animating from scale(0) can cause visual issues
- Element might not render correctly at scale(0)
- Can cause jank or visual glitches
- Better to use opacity or other properties

Solution:
- Use opacity for fade in/out
- Use translateY/translateX for movement
- Combine multiple properties if needed
- Avoid extreme scale values like 0

DON'T ANIMATE SUBSEQUENT TOOLTIPS

Pattern for tooltip interactions:
- First tooltip: Has delay before appearing (prevents accidental activation)
- Subsequent tooltips: No delay, no animation
- Feels faster without defeating purpose of initial delay

Implementation:
- Add delay to first tooltip
- Remove delay and animation for subsequent hovers
- Example: Radix UI and Base UI implement this

MAKE YOUR ANIMATIONS ORIGIN AWARE

Concept: Animate from the trigger point
- Dropdown should animate from button
- Modal should animate from trigger element
- Creates spatial relationship
- Makes interaction feel more connected

Implementation:
- Set transform-origin to trigger point
- Example: transform-origin: top center for dropdown
- Adjust based on where animation originates

KEEP YOUR ANIMATIONS FAST

General rule: Under 300ms for most UI animations
- Improves perceived performance
- Keeps connection between action and response
- Makes UI feel responsive
- No animation should be longer than 1s (unless illustrative)

Exceptions:
- Marketing pages: Can be longer
- Large elements: Can be slower
- Complex animations: May need more time

DON'T ANIMATE KEYBOARD INTERACTIONS

Keyboard-initiated actions should NOT be animated:
- Arrow key navigation
- Keyboard shortcuts
- Text input
- Any rapid keyboard action

Why:
- Actions repeated hundreds of times daily
- Animation makes them feel slow and disconnected
- Delays feel like lag
- Breaks connection between action and response
- User expects instant feedback

BE CAREFUL WITH FREQUENTLY USED ELEMENTS

Elements used multiple times daily:
- Minimize or remove animations
- If animation exists, keep it very short
- Consider no animation at all
- Delight fades with repeated use
- Animation becomes friction

Example: Hover effects
- Nice in demo
- Annoying when used 50+ times daily
- Consider removing for frequently used elements

HOVER FLICKER

Problem: Hover effects can cause flickering
- Cursor position near element boundary
- Triggers hover in/out repeatedly
- Creates flicker effect

Solution: Appropriate target area
- Make hover area larger than visual element
- Padding around element
- Prevents accidental hover exit
- Smoother interaction

CSS:
.element {
  padding: 10px;
  /* Hover area includes padding */
}

APPROPRIATE TARGET AREA

Make interactive areas appropriately sized:
- Minimum 44x44px for touch targets
- Larger for frequently used elements
- Hover area should be generous
- Prevents accidental misses

USE EASE-OUT FOR ENTER AND EXIT ANIMATIONS

When to use:
- Elements entering screen
- Elements exiting screen
- User-initiated interactions
- Gives feeling of responsiveness
- Acceleration at beginning signals responsiveness

CSS:
transition: all 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);

USE EASE-IN-OUT FOR ELEMENTS ALREADY ON SCREEN

When to use:
- Elements moving to new position
- Elements morphing shape
- Elements staying on screen
- Mimics natural acceleration/deceleration

CSS:
transition: all 300ms cubic-bezier(0.455, 0.03, 0.515, 0.955);

DISABLE HOVER EFFECTS ON TOUCH DEVICES

Problem: Hover effects don't make sense on touch
- Touch devices don't have hover state
- Hover effects can be confusing
- May trigger unintended animations

Solution: Use media query
CSS:
@media (hover: hover) {
  button:hover {
    /* hover effects only on devices with hover capability */
  }
}

Or use JavaScript:
if (window.matchMedia("(hover: hover)").matches) {
  // Add hover effects
}

USE CUSTOM EASING CURVES

Always prefer custom easing over built-in CSS easings:
- Built-in easings not strong enough
- Custom curves feel more energetic
- Use cubic-bezier() function
- Experiment to find perfect curve
- Reference easing blueprint for common curves

USE BLUR WHEN NOTHING ELSE WORKS

Blur as last resort:
- Fills visual gap between states
- Eye sees two distinct objects without blur
- Blur blends states together
- Tricks eye into seeing smooth transition
- Keep blur values ≤ 20px

Example: Button state change
- Without blur: Two distinct states
- With blur: Smooth transition between states

CSS:
transition: filter 300ms ease-out;

.element.active {
  filter: blur(0);
}

.element {
  filter: blur(5px);
}

DOES THIS MATTER?

Yes, these details matter:
- Separate good animations from great animations
- Small details accumulate
- Users feel the care and attention
- Makes product feel polished
- Differentiates from competitors
- Worth the time and effort

================================================================================
SUMMARY: KEY PRINCIPLES FOR GREAT ANIMATIONS
================================================================================

1. MAKE IT FEEL NATURAL
   - Use appropriate easing (ease-out, ease-in-out)
   - Avoid linear and ease-in
   - Consider spring animations for complex motion
   - Mirror real-world physics

2. GIVE IT PURPOSE
   - Ask "why" before animating
   - Explain features, show responsiveness, create delight
   - Consider frequency of use
   - Don't animate everything

3. DEVELOP TASTE
   - Study great animations
   - Record and analyze frame-by-frame
   - Practice creating animations
   - Seek feedback
   - Care about your work

4. KEEP IT FAST
   - Under 300ms for most UI animations
   - Improves perceived performance
   - Keeps connection to user action
   - Makes UI feel responsive

5. USE CUSTOM EASING
   - Always use custom curves over built-in easings
   - Refer to easing blueprint
   - Experiment with cubic-bezier()
   - More energetic and natural

6. CONSIDER CONTEXT
   - Frequency of use matters
   - Size of element affects duration
   - Marketing vs product animations differ
   - Touch devices need different approach

7. SWEAT THE DETAILS
   - Record and review animations
   - Fix shaky animations with will-change
   - Make animations origin-aware
   - Disable hover on touch devices
   - Use appropriate target areas

8. USE AI WISELY
   - Feed animation principles to LLMs
   - Use RULE.md for Cursor/Claude/ChatGPT
   - Don't outsource thinking and care
   - Stay involved in creative process

================================================================================
END OF ANIMATION THEORY GUIDE
================================================================================


================================================================================
MODULE 02: CSS ANIMATIONS
================================================================================

LESSON 1: TRANSFORMS
================================================================================

Core Concept: The transform property allows you to change how an element looks.
You can move, rotate, scale, and translate elements. This unlocks many animation 
possibilities.

TRANSFORM FUNCTIONS:

1. TRANSLATE - Move elements around
   - translate(x, y) or translateX(x) or translateY(y)
   - Positive values move down and right; negative move up and left
   - Does NOT change position in document flow
   - Other elements laid out as if element hadn't moved
   - Percentages are relative to element's own size
   
   Example: translateY(100%) moves element down by its own height
   Use case: Sonner toasts use translateY() with percentages for variable heights
   Use case: Vaul drawer uses translateY(100%) to hide before animating in
   
   Tip: Prefer percentages over hardcoded values - less error prone

2. SCALE - Resize elements
   - scale(multiplier) - scale(2) makes element twice as big
   - scaleX(x) and scaleY(y) for individual axes
   - Works as multiplier on children (good for buttons)
   - scale(0.97) on :active pseudo-class makes UI feel responsive
   
   CSS Example:
   button {
     transition: transform 150ms ease;
   }
   button:active {
     transform: scale(0.97);
   }
   
   Use case: Button press feedback
   Use case: Enter transitions with scale + opacity
   Use case: Zoom effects (scales border radius correctly too)
   
   Important: NEVER animate from scale(0) - looks weird and unnatural
   Alternative: Use scale(0.5) with opacity animation instead

3. ROTATE - Rotate elements
   - rotate(degrees) - rotate(45deg) rotates 45 degrees
   - Less common than translate and scale
   - Works best with ease-in-out easing (feels natural)
   - Used in trash interaction with translate + rotate combination

4. 3D TRANSFORMS - Create depth effects
   - rotateX and rotateY - rotate around specific axes
   - rotateX: Like a rotisserie chicken (vertical axis)
   - rotateY: Like a revolving door (horizontal axis)
   - 180° shows back of element
   - translateZ: Move along z-axis (positive = closer, negative = farther)
   
   Requirements for 3D:
   - transform-style: preserve-3d on parent (enables 3D positioning)
   - perspective on parent (defines viewer distance, creates depth)
   - Smaller perspective values = more pronounced 3D effect
   
   Use case: 3D coin animations
   Use case: Loading animations with rotating elements

TRANSFORM ORIGIN - Where transforms execute from:
   - Default: center of element
   - Can change to influence animation behavior
   - Popovers should animate from trigger, not center
   - More natural as won't appear out of nowhere
   
   CSS:
   transform-origin: top center;
   
   Radix UI supports this via CSS variable

ORDER OF TRANSFORMS MATTERS:
   - Different order = different result
   - transform: translateX(100px) rotate(45deg);
   - vs
   - transform: rotate(45deg) translateX(100px);
   - Second one rotates the translation direction too

================================================================================
LESSON 2: CSS TRANSITIONS
================================================================================

Core Concept: CSS transitions interpolate between initial and target states.
Interpolation is calculating values between known states.

TRANSITION PROPERTY - Shorthand for 4 properties:

.element {
  transition: transform 200ms ease 100ms;
}

Breaking it down:
- transition-property: What to animate (transform, opacity, background-color, all)
- transition-duration: How long (200ms, 1s)
- transition-timing-function: Easing (ease, cubic-bezier())
- transition-delay: Wait before starting (100ms, 1s)

TRANSITIONS ARE INTERRUPTIBLE:
- If you hover and unhover before transition finishes, it smoothly transitions back
- Important difference from keyframe animations (not interruptible)

BEST PRACTICES:

1. Keep animations fast (under 300ms usually)
2. Avoid using "all" keyword - be explicit about properties
3. Use ease as default timing function (it's the default anyway)
4. Don't use transition-delay in shorthand (confusing to read)

CSS Pattern:
.box {
  transition: 0.2s ease;
  transition-property: transform, opacity;
}

COMMON USE CASES:

1. Simple Transform - Move element on hover
   - Use translateY or translateX
   - Combine with ease-out easing
   - Duration: 200ms

2. Card Hover - Reveal hidden description
   - Use transform to hide/show
   - Combine with opacity
   - Smooth transition between states

3. Download Arrow - Animate multiple elements
   - Animate arrow down
   - Reveal second arrow from top
   - Both at same time with same duration

4. Toast Component - Enter animation with CSS transitions
   - Can change end state mid-way
   - Interruptible (important for toasts)
   - Especially useful when animation can be interrupted

HOVER EFFECTS:

Disable on touch devices:
@media (hover: hover) {
  button:hover {
    /* hover effects only on devices with hover */
  }
}

Or with JavaScript:
if (window.matchMedia("(hover: hover)").matches) {
  // Add hover effects
}

================================================================================
LESSON 3: KEYFRAME ANIMATIONS
================================================================================

Core Concept: Keyframe animations offer another way to interpolate between states.
Define multiple steps/states in animation sequence.

KEYFRAME ANIMATIONS VS TRANSITIONS:

Use Keyframe Animations When:
- Need infinite loops (marquee, spinner)
- Animation runs automatically (intro animation)
- Need multiple steps/states (pulse animation)
- Simple enter/exit transitions without interruption support (dialog, popup)

Use CSS Transitions When:
- User interaction triggers change (hover, click)
- Need smooth interruption handling (Sonner)

CREATING KEYFRAME ANIMATIONS:

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.element {
  animation: fade-in 1s ease;
}

Animation property shorthand:
- animation-name: fade-in
- animation-duration: 1s
- animation-timing-function: ease

KEY PROPERTIES:

1. animation-iteration-count
   - Default: 1
   - infinite: Run forever
   - Rarely use values between 1 and infinite
   - Marquee example: animation-iteration-count: infinite;

2. Multiple Steps in Keyframes
   Example: Blinking cursor
   @keyframes blink {
     0% { visibility: visible; }
     50% { visibility: hidden; }
     100% { visibility: visible; }
   }
   
   Simplified (CSS auto-fills 0% and 100%):
   @keyframes blink {
     50% { visibility: hidden; }
   }

3. animation-fill-mode - How animation applies styles
   - forwards: Maintain end state (most common)
   - backwards: Apply first keyframe before animation starts
   - both: Apply both
   - Default: Resets to initial state after animation
   
   Use case: Dialog/popover should maintain end state
   Use case: Delayed animations with backwards (no need to adjust initial styles)

4. animation-direction - Play direction
   - normal: Forward (default)
   - reverse: Backward
   - alternate: Forward then backward
   - alternate-reverse: Backward then forward
   
   Example with alternate:
   .box {
     animation: xTranslate 2s cubic-bezier(0.645, 0.045, 0.355, 1);
     animation-iteration-count: infinite;
     animation-direction: alternate;
   }

5. animation-play-state - Pause/resume
   - running: Play (default)
   - paused: Pause animation
   - Unique feature vs transitions
   - Rarely used but good to know

EXERCISES:

1. Text Reveal - Each letter shown with slight delay
   - Use @keyframes with opacity/transform
   - Stagger delays for each letter
   - Replay button to reset animation

2. Orbiting Animation - Element orbits around another
   - Combine keyframe animations with 3D transforms
   - Use rotateY or rotateX
   - Bonus: Scale based on distance for depth effect

================================================================================
LESSON 4: THE MAGIC OF CLIP PATH
================================================================================

Core Concept: clip-path clips element into specific shape. Content outside 
clipping region is hidden; inside is visible. Great for animations!

THE BASICS:

.circle {
  clip-path: circle(50% at 50% 50%);
}

Key properties:
- No effect on layout (like transform)
- Element occupies same space as without clip-path
- Coordinate system: (0, 0) at top left

CLIP PATH VALUES:

1. circle(radius at x y)
   - circle(50% at 50% 50%) = centered circle
   - Positioned by coordinates

2. ellipse(rx ry at x y)
   - Similar to circle but with different radii

3. polygon(x1 y1, x2 y2, ...)
   - Create custom shapes with points

4. inset(top right bottom left)
   - Define offsets of rectangle
   - inset(100%) = hide whole element
   - inset(0 50% 0 0) = hide right half
   - inset(0 0 100% 0) = hide bottom half
   - Hardware-accelerated!

5. url() - Use custom SVG as clipping path

ANIMATION USE CASES:

1. Comparison Sliders (Before/After)
   - Overlay two images
   - Use clip-path: inset(0 50% 0 0) on top image
   - Adjust based on drag position
   - Hardware-accelerated, no extra DOM elements
   - More performant than width approach

2. Text Mask Effects
   - Overlay two text elements (dashed + solid)
   - Hide bottom half of dashed: clip-path: inset(0 0 50% 0)
   - Hide top half of solid: clip-path: inset(50% 0 0 0)
   - Adjust based on mouse position
   - Creates creative reveal effects

3. Image Reveal Animation
   .image-reveal {
     clip-path: inset(0 0 100% 0);
     animation: reveal 1s forwards cubic-bezier(0.77, 0, 0.175, 1);
   }
   
   @keyframes reveal {
     to {
       clip-path: inset(0 0 0 0);
     }
   }
   
   Benefits:
   - Hardware-accelerated
   - More performant than height animation
   - No layout shift (image already there)

4. Scroll Animations - Trigger on scroll
   - Use Intersection Observer API or Framer Motion's useInView
   - Trigger animation when element enters viewport
   - Example: Image reveal on scroll
   
   Framer Motion approach:
   const isInView = useInView(ref, { once: true, margin: "-100px" });
   - once: true = trigger only once
   - margin: "-100px" = trigger when 100px in view

5. Tabs Transition - Seamless tab switching
   - Duplicate tab list with active styling
   - Use clip-path to show only active tab in duplicate
   - Animate clip-path on click to reveal new active tab
   - Seamless transition without color timing issues
   
   Technique:
   - clip-path: inset(0 74% 0 0% round 17px)
   - Animate inset values on click
   - Reveals new active tab smoothly

BENEFITS OF CLIP PATH FOR ANIMATIONS:

- Hardware-accelerated (performant)
- No layout shifts
- No extra DOM elements needed
- Creative possibilities
- Works with transitions and keyframes

================================================================================
MODULE 03: FRAMER MOTION
================================================================================

LESSON 1: WHY FRAMER MOTION
================================================================================

What is Framer Motion?
- JavaScript animation library for React
- Creates impressive, native-like animations with minimal code
- Makes complex animations easier to build
- But "magic" makes debugging hard when issues arise

WHY USE FRAMER MOTION?

Everything possible with Framer Motion is possible with vanilla CSS/JS, but:
- Takes significantly more time
- Requires more code
- More complex to implement

Example: Tab highlight animation
- Calculate highlight position based on tab dimensions
- Calculate distance from left side
- Smoothly change direction
- All in 76 lines of code with Framer Motion
- Would take much longer without it

Key Advantages:

1. INTERRUPTIBLE ANIMATIONS
   - Maintains momentum when interrupted
   - Smooth redirection mid-animation
   - Preserves velocity
   - 33 lines of code for spring animation
   - Would be massive amount of work without Framer Motion

2. ANIMATE EXIT STATES
   - Difficult to animate components being removed from DOM
   - Wrap with AnimatePresence to animate out
   
   import { motion, AnimatePresence } from "framer-motion";
   
   export function Component({ isVisible }) {
     return (
       <AnimatePresence>
         {isVisible ? (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
           />
         ) : null}
       </AnimatePresence>
     );
   }

3. LAYOUT ANIMATIONS
   - Animate properties not possible with CSS
   - Example: flex-direction changes
   - Simply change flex-direction, Framer Motion animates it
   
   Example: Tab highlight
   - Change flex-direction from row to column
   - Framer Motion animates the transition
   - No manual calculation needed

4. SHARED LAYOUT ANIMATIONS
   - Connect two components
   - Create transition when first is removed
   - Same layoutId tells Framer Motion to animate between them
   - Example: Trash interaction
   - Images aren't moved manually
   - Different elements in trash use same layoutId
   - Framer Motion animates them to new position

5. DRAG AND DROP
   - Built-in drag support
   - Draw SVGs
   - Complex interactions simplified

ANIMATION LIBRARIES COMPARISON:

REACT SPRING:
Pros:
- Spring-based animations
- Smaller package size than Framer Motion
- Highly configurable
- Works well with other Poimandres libraries

Cons:
- Steep learning curve
- More code needed for same animations
- Documentation hard to parse
- Takes more time to write

Example:
import { useSpring, animated } from "@react-spring/web";

function MyComponent() {
  const [props, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }), []);
  
  return <animated.div style={props}>Hello World</animated.div>;
}

GSAP:
Pros:
- Very useful timeline feature
- Easier to learn than alternatives
- Framework-agnostic (can be pro or con)
- Large community, good documentation
- Now free for all uses (was paid for commercial)

Cons:
- Some plugins were paid (now free)
- No spring animations
- Not tailored to React
- Framework-agnostic means less React integration

Example:
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const container = useRef();

useGSAP(() => {
  gsap.to(".box", { opacity: 1 });
}, { scope: container });

FRAMER MOTION:
Pros:
- Declarative API (simple, clean syntax)
- Imperative API available for complex cases
- Layout animations (animate non-CSS properties)
- Shared layout animations
- Tailored to React
- Less room for error with declarative approach
- Easier to scale

Cons:
- Larger package size
- "Magic" makes debugging hard
- Documentation follows happy path
- Issues not in docs can be hard to solve

Declarative Example:
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

Imperative Example:
function ImperativeComponent() {
  const [scope, animate] = useAnimate();
  
  useEffect(() => {
    animate("li", { opacity: 1 });
  });
  
  return <ul ref={scope}>{children}</ul>;
}

FRAMER MOTION IS NOW MOTION:
- Library renamed from Framer Motion to Motion
- Same functionality, new name
- Update your imports accordingly

================================================================================
SUMMARY: COMPLETE ANIMATION WORKFLOW
================================================================================

DECISION TREE:

1. Is it a simple hover effect?
   → Use CSS Transition (200ms, ease)

2. Does it need to be interrupted smoothly?
   → Use CSS Transition (interruptible)

3. Does it run automatically/infinitely?
   → Use CSS Keyframe Animation

4. Does it need multiple steps?
   → Use CSS Keyframe Animation or Framer Motion

5. Is it complex with multiple properties?
   → Use Framer Motion (easier, cleaner code)

6. Do you need spring animations?
   → Use Framer Motion or React Spring

7. Do you need layout animations?
   → Use Framer Motion (only option for this)

PERFORMANCE CHECKLIST:

✓ Animate only: opacity, transform
✗ Avoid: top, left, width, height (use transform instead)
✓ Use will-change for transform, opacity, clipPath, filter
✓ Keep blur values ≤ 20px
✓ Use hardware-accelerated properties
✓ Test on actual devices, not just desktop

EASING QUICK REFERENCE:

Enter/Exit Animations → ease-out
Elements Moving On-Screen → ease-in-out
Hover Effects → ease
Constant Motion → linear (rare)
Avoid → ease-in (makes UI feel slow)

DURATION QUICK REFERENCE:

Hover Effects → 200ms
Enter/Exit → 200-300ms
Large Elements → 400-500ms
Marketing Pages → 500ms-1s
Keyboard Interactions → 0ms (no animation)

TESTING TIPS:

1. Record animations and scrub frame-by-frame
2. Test at different speeds (slow down to see details)
3. Test on actual devices (not just browser)
4. Test with touch devices (disable hover)
5. Test interruption scenarios
6. Compare with reference animations

================================================================================
END OF COMPREHENSIVE ANIMATION GUIDE
================================================================================

This guide covers all three modules of the animations.dev course:
- Module 01: Animation Theory (principles and concepts)
- Module 02: CSS Animations (implementation with CSS)
- Module 03: Framer Motion (advanced animations with React)

Use this as a reference when building animations or feeding to AI tools like
VS Code Copilot, Claude, or ChatGPT for animation assistance.
