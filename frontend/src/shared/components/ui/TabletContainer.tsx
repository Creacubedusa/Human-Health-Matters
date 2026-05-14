import { useWindowDimensions, View } from 'react-native';
import type { ReactNode } from 'react';

const TABLET_BREAKPOINT = 768;
const MAX_CONTENT_WIDTH = 500;

interface TabletContainerProps {
    children: ReactNode;
    /** Override the max width for content on tablets. Default: 500 */
    maxWidth?: number;
    /** Additional className for the outer wrapper */
    className?: string;
}

/**
 * Centers content on tablet-sized screens while remaining full-width on phones.
 * Wrap form screens or content areas with this to get tablet responsiveness.
 *
 * On phones (< 768px width): renders children as-is with no constraints.
 * On tablets (>= 768px width): constrains children to maxWidth and centers them.
 */
export function TabletContainer({
    children,
    maxWidth = MAX_CONTENT_WIDTH,
    className = '',
}: TabletContainerProps) {
    const { width } = useWindowDimensions();

    if (width < TABLET_BREAKPOINT) {
        // Phone — full width, just a flex container for proper absolute positioning
        return <View className={`flex-1 ${className}`}>{children}</View>;
    }

    // Tablet — center content with max width
    return (
        <View
            className={`flex-1 items-center ${className}`}
        >
            <View style={{ width: '100%', maxWidth, flex: 1 }}>
                {children}
            </View>
        </View>
    );
}
