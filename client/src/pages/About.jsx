import CallToAction from '../components/CallToAction';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About Me
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Hey there! I'm a curious coder, full-time tech explorer, and part-time
              philosopher (mostly while staring at bugs at 2 AM). Whether it's writing Java programs,
              debugging mysterious errors, or building something new on the web — I'm always up
              for a challenge.
            </p>

            <p>
              I created this blog to share the rollercoaster ride of my learning journey — from
              "Hello World" to full-blown projects, with a few crashes and coffee stains in between.
              Expect posts on programming, web development, tech rants, side projects, and the
              occasional joke only other developers might laugh at (maybe).
            </p>

            <p>
              When I'm not busy breaking and fixing code, you'll find me riding unplanned bike
              rides with my dad, chilling with retro songs on the balcony, or dreaming up the
              next cool thing to build. This blog is my digital notepad and you're welcome
              to scribble too — comment, react, rant, or share your wisdom!
            </p>
          </div>
        </div>
        <div className='mt-10'>
          <CallToAction />
        </div>
      </div>
    </div>
  );
}
