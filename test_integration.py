"""
Integration test script for ReWear backend-frontend integration
Run this to verify the integration is working correctly.
"""
import requests
import json


def test_backend_integration():
    """Test various backend endpoints to ensure integration works"""
    
    base_url = "http://localhost:8000/api"
    
    # Test endpoints
    endpoints = [
        {"url": f"{base_url}/hello/", "method": "GET", "name": "Hello endpoint"},
        {"url": f"{base_url}/categories/", "method": "GET", "name": "Categories"},
        {"url": f"{base_url}/items/", "method": "GET", "name": "Items list"},
        {"url": f"{base_url}/items/featured/", "method": "GET", "name": "Featured items"},
    ]
    
    results = []
    
    for endpoint in endpoints:
        try:
            if endpoint["method"] == "GET":
                response = requests.get(endpoint["url"], timeout=5)
                
            result = {
                "name": endpoint["name"],
                "url": endpoint["url"],
                "status": response.status_code,
                "success": response.status_code == 200,
                "response": response.json() if response.headers.get('content-type') == 'application/json' else response.text[:100]
            }
            results.append(result)
            
        except requests.exceptions.RequestException as e:
            result = {
                "name": endpoint["name"],
                "url": endpoint["url"],
                "status": "Error",
                "success": False,
                "error": str(e)
            }
            results.append(result)
    
    # Print results
    print("=" * 60)
    print("REWEAR BACKEND INTEGRATION TEST RESULTS")
    print("=" * 60)
    
    for result in results:
        status = "✅ PASS" if result["success"] else "❌ FAIL"
        print(f"{status} | {result['name']}")
        print(f"      URL: {result['url']}")
        print(f"      Status: {result['status']}")
        if not result["success"] and "error" in result:
            print(f"      Error: {result['error']}")
        print()
    
    # Overall summary
    passed = sum(1 for r in results if r["success"])
    total = len(results)
    print(f"Overall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All integration tests passed! Backend is ready.")
    else:
        print("⚠️  Some tests failed. Check backend configuration.")


if __name__ == "__main__":
    test_backend_integration()
