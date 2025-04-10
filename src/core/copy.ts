export class Copy {
    public static deep<T>(target: T): T {
        return JSON.parse(JSON.stringify(target));
    }

    public static shallow<T>(target: T): T {
        return { ...target };
    }
}
