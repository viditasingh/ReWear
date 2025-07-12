import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Recycle, Users, Star, Shirt } from 'lucide-react';
import { useGetFeaturedItemsQuery } from '../store/api/itemsApi';
import ItemCard from '../components/ItemCard';
import Card from '../components/ui/Card';

const Home = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const { data: featuredItems, isLoading } = useGetFeaturedItemsQuery();

  const features = [
    {
      icon: <Recycle className="h-8 w-8 text-primary-600" />,
      title: "Sustainable Fashion",
      description: "Give your clothes a second life and reduce textile waste by participating in our community exchange."
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: "Community Driven",
      description: "Connect with like-minded individuals who share your passion for sustainable living and fashion."
    },
    {
      icon: <Star className="h-8 w-8 text-primary-600" />,
      title: "Quality Guaranteed",
      description: "Every item is reviewed and rated by our community to ensure you get the best quality exchanges."
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Items Exchanged", value: "25K+" },
    { label: "CO2 Saved", value: "50 Tons" },
    { label: "Communities", value: "100+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="text-secondary-900">Rewear,</span>
                <br />
                <span className="text-secondary-900">Reuse,</span>
                <br />
                <span className="text-gradient animate-glow">Revolutionize</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-secondary-600 leading-relaxed">
                Join our community of fashion lovers who believe in sustainable style. 
                Exchange, discover, and transform your wardrobe while caring for our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/signup"
                      className="bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      Start Swapping
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/items"
                      className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Browse Items
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/add-item"
                      className="bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                    >
                      List an Item
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/dashboard"
                      className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                      My Dashboard
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center justify-center h-64">
                    <Shirt className="h-32 w-32 text-primary-600" />
                  </div>
                  <div className="text-center text-gray-800">
                    <h3 className="text-xl font-bold mb-2">Your Next Favorite Outfit</h3>
                    <p className="text-gray-600">Waiting to be discovered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-neutral-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-3 group-hover:animate-pulse">
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Why Choose <span className="text-gradient">ReWear</span>?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Join a community that values sustainability, style, and shared experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 card-modern group cursor-pointer" hover>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl group-hover:shadow-lg transition-all duration-300">
                    {React.cloneElement(feature.icon, { className: "h-8 w-8 text-primary-600" })}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-24 bg-gradient-to-b from-white to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Featured <span className="text-gradient">Items</span>
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              Discover the most popular items in our community
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-neutral-200 h-64 rounded-2xl mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded-lg w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredItems?.slice(0, 8).map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-16">
            <Link
              to="/items"
              className="btn-modern gradient-primary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-gentle hover:shadow-strong transition-all duration-300 inline-flex items-center group"
            >
              View All Items
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-secondary relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-secondary-800 opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary-400 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Start Your 
            <br />
            <span className="text-primary-300">Sustainable Fashion Journey?</span>
          </h2>
          <p className="text-xl text-secondary-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already making a difference through conscious fashion choices
          </p>
          {!isAuthenticated ? (
            <Link
              to="/signup"
              className="btn-modern bg-white text-secondary-700 px-12 py-5 rounded-xl font-bold text-lg shadow-strong hover:shadow-intense hover:bg-primary-50 transition-all duration-300 inline-flex items-center group"
            >
              Get Started Today
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <Link
              to="/add-item"
              className="btn-modern bg-white text-secondary-700 px-12 py-5 rounded-xl font-bold text-lg shadow-strong hover:shadow-intense hover:bg-primary-50 transition-all duration-300 inline-flex items-center group"
            >
              List Your First Item
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;