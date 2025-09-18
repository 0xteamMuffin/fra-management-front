import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">FRA Atlas</h3>
                <p className="text-xs text-muted-foreground">
                  Government Portal
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Forest Rights Act implementation and monitoring platform for
              transparent land rights management.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/claims"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Submit FRA Claim
              </Link>
              <Link
                href="/atlas"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View Atlas Map
              </Link>
              <Link
                href="/verification"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Claim Verification
              </Link>
              <Link
                href="/monitoring"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                IoT Monitoring
              </Link>
            </nav>
          </div>

          {/* Government Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Government</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
              >
                Ministry of Tribal Affairs
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
              >
                Forest Department
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
              >
                Digital India
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@fraatlas.gov.in</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1800-XXX-XXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-xs text-muted-foreground">
            © 2024 Government of India. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
