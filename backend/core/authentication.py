from rest_framework.authentication import TokenAuthentication


class CsrfExemptTokenAuthentication(TokenAuthentication):
    """Token authentication that exempts CSRF verification"""
    
    def authenticate(self, request):
        result = super().authenticate(request)
        if result:
            # If token authentication succeeds, mark the view as CSRF exempt
            setattr(request, '_dont_enforce_csrf_checks', True)
        return result
