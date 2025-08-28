const HeroTitle = () => {
  return (
    <div className="space-y-4">
      <h1 className="hero-title text-5xl lg:text-6xl font-bold leading-tight">
        Discover Your Next
        <span className="block bg-gradient-hero bg-clip-text text-transparent">
          Destination
        </span>
      </h1>
      <p className="hero-subtitle text-xl text-muted-foreground max-w-lg">
        Find amazing places, restaurants, and experiences near you with
        real-time recommendations powered by your location.
      </p>
    </div>
  );
};

export default HeroTitle;
